import type { INodeProperties } from 'n8n-workflow';
import { externalTransactionListDescription } from './list';

const showOnlyForExternalTransactions = { resource: ['externalTransaction'] };

export const externalTransactionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForExternalTransactions },
		options: [
			{
				name: 'Get Many',
				value: 'list',
				action: 'List external transactions',
				description: 'List transactions on connected (Plaid/Finicity) external accounts',
			},
		],
		default: 'list',
	},
	...externalTransactionListDescription,
];
