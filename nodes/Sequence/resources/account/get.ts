import type { INodeProperties } from 'n8n-workflow';

const show = { operation: ['get'], resource: ['account'] };

export const accountGetDescription: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'The account ID to retrieve',
	},
];
