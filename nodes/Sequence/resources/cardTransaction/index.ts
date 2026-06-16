import type { INodeProperties } from 'n8n-workflow';
import { dateRangeFilters, listOutput, returnAllAndLimit } from '../shared';

const show = { resource: ['cardTransaction'] };

export const cardTransactionDescription: INodeProperties[] = [
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
				action: 'List card transactions',
				description: 'List settled debit/omni card purchases and refunds funded by a pod',
				routing: {
					request: { method: 'GET', url: '/card-transactions' },
					output: listOutput,
				},
			},
		],
		default: 'list',
	},
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'Pod ID that funded the card transactions',
		routing: { send: { type: 'query', property: 'accountId' } },
	},
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		default: '',
		displayOptions: { show },
		description: 'Optional: filter to a single debit or omni card',
		routing: { send: { type: 'query', property: 'cardId', value: '={{ $value || undefined }}' } },
	},
	...dateRangeFilters(show),
	...returnAllAndLimit(show),
];
