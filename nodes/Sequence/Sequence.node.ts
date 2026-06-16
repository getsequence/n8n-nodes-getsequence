import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { accountDescription } from './resources/account';
import { transferDescription } from './resources/transfer';
import { ruleDescription } from './resources/rule';
import { executionDescription } from './resources/execution';
import { cardTransactionDescription } from './resources/cardTransaction';
import { externalTransactionDescription } from './resources/externalTransaction';

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
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Card Transaction', value: 'cardTransaction' },
					{ name: 'External Transaction', value: 'externalTransaction' },
					{ name: 'Rule', value: 'rule' },
					{ name: 'Rule Execution', value: 'execution' },
					{ name: 'Transfer', value: 'transfer' },
				],
				default: 'account',
			},
			...accountDescription,
			...transferDescription,
			...ruleDescription,
			...executionDescription,
			...cardTransactionDescription,
			...externalTransactionDescription,
		],
	};
}
