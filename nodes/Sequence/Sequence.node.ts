import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { accountDescription } from './resources/account';
import { activityDescription } from './resources/activity';
import { ruleDescription } from './resources/rule';
import { executionDescription } from './resources/execution';

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
					{ name: 'Activity', value: 'activity' },
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
}
