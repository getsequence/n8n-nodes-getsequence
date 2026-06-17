import type { INodeProperties } from 'n8n-workflow';
import { dateRangeFilters, returnAllAndLimit } from '../shared';

const show = { operation: ['listCardTransactions'], resource: ['activity'] };

export const activityCardTransactionsDescription: INodeProperties[] = [
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
