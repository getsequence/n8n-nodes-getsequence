import type { INodeProperties } from 'n8n-workflow';

const show = { operation: ['get'], resource: ['rule'] };

export const ruleGetDescription: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'The rule ID to retrieve',
	},
];
