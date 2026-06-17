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
		routing: {
			send: {
				type: 'query',
				property: 'accountIds',
				value: '={{ $value.split(",").map((s) => s.trim()).filter((s) => s) }}',
			},
		},
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
		routing: { send: { type: 'query', property: 'direction', value: '={{ $value || undefined }}' } },
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
		routing: { send: { type: 'query', property: 'status', value: '={{ $value || undefined }}' } },
	},
	...dateRangeFilters(show),
	...returnAllAndLimit(show),
];
