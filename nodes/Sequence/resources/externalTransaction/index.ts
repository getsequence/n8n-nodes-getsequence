import type { INodeProperties } from 'n8n-workflow';
import { dateRangeFilters, listOutput, returnAllAndLimit } from '../shared';

const show = { resource: ['externalTransaction'] };

export const externalTransactionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Get Many',
				value: 'list',
				action: 'List external transactions',
				description: 'List transactions on connected (Plaid/Finicity) external accounts',
				routing: {
					request: { method: 'GET', url: '/external-transactions' },
					output: listOutput,
				},
			},
		],
		default: 'list',
	},
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
			{ name: 'Pending', value: 'PENDING' },
			{ name: 'Complete', value: 'COMPLETE' },
		],
		routing: { send: { type: 'query', property: 'status', value: '={{ $value || undefined }}' } },
	},
	...dateRangeFilters(show),
	...returnAllAndLimit(show),
];
