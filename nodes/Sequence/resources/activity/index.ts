import type { INodeProperties } from 'n8n-workflow';
import { activityCreateTransferDescription } from './createTransfer';
import { activityGetTransferDescription } from './getTransfer';
import { activityListTransfersDescription } from './listTransfers';
import { activityCardTransactionsDescription } from './cardTransactions';
import { activityExternalTransactionsDescription } from './externalTransactions';

const showOnlyForActivity = { resource: ['activity'] };

export const activityDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForActivity },
		options: [
			{
				name: 'Create Transfer',
				value: 'createTransfer',
				action: 'Create a transfer',
				description: 'Create an ACH transfer (supports dry-run simulation)',
			},
			{
				name: 'Get Transfer',
				value: 'getTransfer',
				action: 'Get a transfer',
				description: 'Get a single transfer by ID',
			},
			{
				name: 'List Card Transactions',
				value: 'listCardTransactions',
				action: 'List card transactions',
				description: 'List settled debit/omni card purchases and refunds funded by a pod',
			},
			{
				name: 'List External Transactions',
				value: 'listExternalTransactions',
				action: 'List external transactions',
				description: 'List transactions on connected (Plaid/Finicity) external accounts',
			},
			{
				name: 'List Transfers',
				value: 'listTransfers',
				action: 'List transfers',
				description: 'List transfers for one or more accounts',
			},
		],
		default: 'listTransfers',
	},
	...activityCreateTransferDescription,
	...activityGetTransferDescription,
	...activityListTransfersDescription,
	...activityCardTransactionsDescription,
	...activityExternalTransactionsDescription,
];
