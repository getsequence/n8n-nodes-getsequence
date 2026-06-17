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
		// httpRequestWithAuthentication wraps failures in a NodeApiError, which stores
		// the parsed body at `context.data` and the picked message at `description`.
		context?: { data?: SequenceErrorEnvelope };
		description?: string;
		response?: { data?: SequenceErrorEnvelope; body?: SequenceErrorEnvelope };
		cause?: { response?: { data?: SequenceErrorEnvelope; body?: SequenceErrorEnvelope } };
	};
	const env =
		e?.context?.data?.error ??
		e?.response?.data?.error ??
		e?.response?.body?.error ??
		e?.cause?.response?.data?.error ??
		e?.cause?.response?.body?.error;
	if (env?.message) return { message: env.message, description: env.code };
	if (typeof e?.description === 'string' && e.description.length > 0) {
		return { message: e.description };
	}
	return {};
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
					// eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option -- intentional: this resource groups transfers + transactions
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
