import {
	NodeApiError,
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';
import { accountDescription } from './resources/account';
import { activityDescription } from './resources/activity';
import { ruleDescription } from './resources/rule';
import { executionDescription } from './resources/execution';
import { executeOperation } from './router';

interface SequenceErrorEnvelope {
	error?: { code?: string; message?: string };
}

/**
 * Surfaces the API's `{ error: { code, message } }` envelope so users see the
 * real reason (e.g. "This rule cannot be accessed using the API") instead of a
 * generic "Forbidden". The body sits under response.data or response.body
 * depending on the HTTP client path.
 */
function apiErrorOverride(error: unknown): { message?: string; description?: string } {
	const e = error as {
		response?: { data?: SequenceErrorEnvelope; body?: SequenceErrorEnvelope };
		cause?: { response?: { data?: SequenceErrorEnvelope; body?: SequenceErrorEnvelope } };
	};
	const env =
		e?.response?.data?.error ??
		e?.response?.body?.error ??
		e?.cause?.response?.data?.error ??
		e?.cause?.response?.body?.error;
	return env?.message ? { message: env.message, description: env.code } : {};
}

export class Sequence implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sequence',
		name: 'sequence',
		icon: 'file:sequence.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Interact with the Sequence Platform v1 API',
		defaults: {
			name: 'Sequence',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'sequenceApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Activity & Transfers', value: 'activity' },
					{ name: 'Rule', value: 'rule' },
					{ name: 'Rule Execution', value: 'execution' },
				],
				default: 'account',
			},
			...accountDescription,
			...activityDescription,
			...ruleDescription,
			...executionDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const out: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const results = await executeOperation(this, resource, operation, i);
				for (const json of results) out.push({ json, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					out.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, {
					itemIndex: i,
					...apiErrorOverride(error),
				});
			}
		}

		return [out];
	}
}
