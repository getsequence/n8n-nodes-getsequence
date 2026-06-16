import type { INodeProperties } from 'n8n-workflow';

const show = { operation: ['get'], resource: ['transfer'] };

export const transferGetDescription: INodeProperties[] = [
	{
		displayName: 'Transfer ID',
		name: 'transferId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'The transfer ID to retrieve. Poll this to track an async transfer.',
	},
];
