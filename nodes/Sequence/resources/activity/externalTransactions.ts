import type { INodeProperties } from 'n8n-workflow';
import { dateRangeFilters, returnAllAndLimit } from '../shared';

const show = { operation: ['listExternalTransactions'], resource: ['activity'] };

export const activityExternalTransactionsDescription: INodeProperties[] = [
	{
		displayName: 'Account IDs',
		name: 'accountIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'Comma-separated external account IDs to filter by',
	},
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		default: '',
		displayOptions: { show },
		options: [
			{ name: 'Any', value: '' },
			{ name: 'Money In', value: 'MONEY_IN' },
			{ name: 'Money Out', value: 'MONEY_OUT' },
		],
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: '',
		displayOptions: { show },
		options: [
			{ name: 'Any', value: '' },
			{ name: 'Complete', value: 'COMPLETE' },
			{ name: 'Pending', value: 'PENDING' },
		],
	},
	...dateRangeFilters(show),
	...returnAllAndLimit(show),
];
