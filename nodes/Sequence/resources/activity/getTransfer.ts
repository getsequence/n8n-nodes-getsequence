import type { INodeProperties } from 'n8n-workflow';

const show = { operation: ['getTransfer'], resource: ['activity'] };

export const activityGetTransferDescription: INodeProperties[] = [
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
