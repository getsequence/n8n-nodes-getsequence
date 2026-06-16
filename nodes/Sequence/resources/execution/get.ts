import type { INodeProperties } from 'n8n-workflow';

const show = { operation: ['get'], resource: ['execution'] };

export const executionGetDescription: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'The rule the execution belongs to',
	},
	{
		displayName: 'Execution ID',
		name: 'executionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'The rule execution ID to retrieve',
	},
];
