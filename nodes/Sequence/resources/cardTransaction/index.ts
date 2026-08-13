import type { INodeProperties } from 'n8n-workflow';
import { cardTransactionListDescription } from './list';

const showOnlyForCardTransactions = { resource: ['cardTransaction'] };

export const cardTransactionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCardTransactions },
		options: [
			{
				name: 'Get Many',
				value: 'list',
				action: 'List card transactions',
				description: 'List settled debit/omni card purchases and refunds funded by a pod',
			},
		],
		default: 'list',
	},
	...cardTransactionListDescription,
];
