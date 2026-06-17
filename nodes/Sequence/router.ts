import {
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
} from 'n8n-workflow';
import { sequenceApiRequest, sequenceApiRequestAllItems } from './transport';

function csvToArray(value: string): string[] {
	return value
		.split(',')
		.map((part) => part.trim())
		.filter((part) => part.length > 0);
}

function addOptional(qs: IDataObject, key: string, value: unknown): void {
	if (value !== '' && value !== undefined && value !== null) qs[key] = value;
}

/**
 * n8n's dateTime field can yield values the API's strict RFC 3339 check rejects
 * (missing timezone, etc.). Normalize to canonical ISO (`...Z`) before sending.
 */
function addDate(qs: IDataObject, key: string, raw: unknown): void {
	if (raw === '' || raw === undefined || raw === null) return;
	const date = new Date(raw as string | number);
	if (!Number.isNaN(date.getTime())) qs[key] = date.toISOString();
}

/** Resolves a list operation to either all pages or a single Page/Limit page. */
async function listResults(
	ctx: IExecuteFunctions,
	i: number,
	endpoint: string,
	filters: IDataObject,
): Promise<IDataObject[]> {
	const returnAll = ctx.getNodeParameter('returnAll', i, false) as boolean;
	if (returnAll) {
		return sequenceApiRequestAllItems.call(ctx, endpoint, filters);
	}
	const qs: IDataObject = {
		...filters,
		pageSize: ctx.getNodeParameter('limit', i, 50),
		page: ctx.getNodeParameter('page', i, 1),
	};
	const response = await sequenceApiRequest.call(ctx, 'GET', endpoint, undefined, qs);
	const items = response?.data?.items;
	return Array.isArray(items) ? items : [];
}

function readTransferFilters(ctx: IExecuteFunctions, i: number): IDataObject {
	const qs: IDataObject = {};
	addOptional(qs, 'direction', ctx.getNodeParameter('direction', i, ''));
	addOptional(qs, 'status', ctx.getNodeParameter('status', i, ''));
	addOptional(qs, 'executionMode', ctx.getNodeParameter('executionMode', i, 'LIVE'));
	addOptional(qs, 'origin', ctx.getNodeParameter('origin', i, ''));
	addOptional(qs, 'rule_execution_id', ctx.getNodeParameter('ruleExecutionId', i, ''));
	addDate(qs, 'from', ctx.getNodeParameter('from', i, ''));
	addDate(qs, 'to', ctx.getNodeParameter('to', i, ''));
	return qs;
}

function idempotencyKey(ctx: IExecuteFunctions, i: number): string {
	const provided = ctx.getNodeParameter('idempotencyKey', i, '') as string;
	return provided || `${ctx.getExecutionId()}-${i}`;
}

export async function executeOperation(
	ctx: IExecuteFunctions,
	resource: string,
	operation: string,
	i: number,
): Promise<IDataObject[]> {
	if (resource === 'account') {
		if (operation === 'list') {
			const filters: IDataObject = {};
			addOptional(filters, 'type', ctx.getNodeParameter('type', i, ''));
			addOptional(filters, 'state', ctx.getNodeParameter('state', i, 'ACTIVE'));
			return listResults(ctx, i, '/accounts', filters);
		}
		if (operation === 'get') {
			const id = ctx.getNodeParameter('accountId', i) as string;
			const response = await sequenceApiRequest.call(ctx, 'GET', `/accounts/${id}`);
			return [response.data];
		}
		if (operation === 'transfers') {
			const id = ctx.getNodeParameter('accountId', i) as string;
			const filters = readTransferFilters(ctx, i);
			addOptional(filters, 'accountRole', ctx.getNodeParameter('accountRole', i, 'either'));
			return listResults(ctx, i, `/accounts/${id}/transfers`, filters);
		}
	}

	if (resource === 'activity') {
		if (operation === 'createTransfer') {
			const body: IDataObject = {
				sourceAccountId: ctx.getNodeParameter('sourceAccountId', i),
				destinationAccountId: ctx.getNodeParameter('destinationAccountId', i),
				amountInCents: ctx.getNodeParameter('amountInCents', i),
				simulation: ctx.getNodeParameter('simulation', i, true),
			};
			addOptional(body, 'description', ctx.getNodeParameter('description', i, ''));
			const response = await sequenceApiRequest.call(ctx, 'POST', '/transfers', body, undefined, {
				'idempotency-key': idempotencyKey(ctx, i),
			});
			return [response.data];
		}
		if (operation === 'getTransfer') {
			const id = ctx.getNodeParameter('transferId', i) as string;
			const response = await sequenceApiRequest.call(ctx, 'GET', `/transfers/${id}`);
			return [response.data];
		}
		if (operation === 'listTransfers') {
			const filters = readTransferFilters(ctx, i);
			filters.accountIds = csvToArray(ctx.getNodeParameter('accountIds', i, '') as string);
			return listResults(ctx, i, '/transfers', filters);
		}
		if (operation === 'listCardTransactions') {
			const filters: IDataObject = { accountId: ctx.getNodeParameter('accountId', i) };
			addOptional(filters, 'cardId', ctx.getNodeParameter('cardId', i, ''));
			addDate(filters, 'from', ctx.getNodeParameter('from', i, ''));
			addDate(filters, 'to', ctx.getNodeParameter('to', i, ''));
			return listResults(ctx, i, '/card-transactions', filters);
		}
		if (operation === 'listExternalTransactions') {
			const filters: IDataObject = {
				accountIds: csvToArray(ctx.getNodeParameter('accountIds', i, '') as string),
			};
			addOptional(filters, 'direction', ctx.getNodeParameter('direction', i, ''));
			addOptional(filters, 'status', ctx.getNodeParameter('status', i, ''));
			addDate(filters, 'from', ctx.getNodeParameter('from', i, ''));
			addDate(filters, 'to', ctx.getNodeParameter('to', i, ''));
			return listResults(ctx, i, '/external-transactions', filters);
		}
	}

	if (resource === 'rule') {
		if (operation === 'list') {
			const filters: IDataObject = {};
			addOptional(filters, 'sourceId', ctx.getNodeParameter('sourceId', i, ''));
			return listResults(ctx, i, '/rules', filters);
		}
		if (operation === 'get') {
			const id = ctx.getNodeParameter('ruleId', i) as string;
			const response = await sequenceApiRequest.call(ctx, 'GET', `/rules/${id}`);
			return [response.data];
		}
		if (operation === 'trigger') {
			const id = ctx.getNodeParameter('ruleId', i) as string;
			const body: IDataObject = { simulation: ctx.getNodeParameter('simulation', i, true) };
			const amount = ctx.getNodeParameter('executeAmount', i, 0) as number;
			if (amount > 0) body.executeAmount = amount;
			const response = await sequenceApiRequest.call(
				ctx,
				'POST',
				`/rules/${id}/trigger`,
				body,
				undefined,
				{ 'idempotency-key': idempotencyKey(ctx, i) },
			);
			return [response.data];
		}
	}

	if (resource === 'execution') {
		if (operation === 'list') {
			const ruleId = ctx.getNodeParameter('ruleId', i) as string;
			const filters: IDataObject = {};
			addOptional(filters, 'status', ctx.getNodeParameter('status', i, ''));
			addOptional(filters, 'triggerType', ctx.getNodeParameter('triggerType', i, ''));
			addOptional(filters, 'executionMode', ctx.getNodeParameter('executionMode', i, 'LIVE'));
			addDate(filters, 'from', ctx.getNodeParameter('from', i, ''));
			addDate(filters, 'to', ctx.getNodeParameter('to', i, ''));
			return listResults(ctx, i, `/rules/${ruleId}/executions`, filters);
		}
		if (operation === 'get') {
			const ruleId = ctx.getNodeParameter('ruleId', i) as string;
			const executionId = ctx.getNodeParameter('executionId', i) as string;
			const response = await sequenceApiRequest.call(
				ctx,
				'GET',
				`/rules/${ruleId}/executions/${executionId}`,
			);
			return [response.data];
		}
	}

	throw new NodeOperationError(
		ctx.getNode(),
		`Unsupported operation "${operation}" for resource "${resource}"`,
	);
}
