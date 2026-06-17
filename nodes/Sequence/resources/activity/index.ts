import type { INodeProperties } from 'n8n-workflow';
import { itemOutput, listOutput } from '../shared';
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
				routing: {
					request: {
						method: 'POST',
						url: '/transfers',
						headers: { 'idempotency-key': '={{ $parameter.idempotencyKey || undefined }}' },
					},
					output: itemOutput,
				},
			},
			{
				name: 'Get Transfer',
				value: 'getTransfer',
				action: 'Get a transfer',
				description: 'Get a single transfer by ID',
				routing: {
					request: { method: 'GET', url: '=/transfers/{{$parameter.transferId}}' },
					output: itemOutput,
				},
			},
			{
				name: 'List Card Transactions',
				value: 'listCardTransactions',
				action: 'List card transactions',
				description: 'List settled debit/omni card purchases and refunds funded by a pod',
				routing: {
					request: { method: 'GET', url: '/card-transactions' },
					output: listOutput,
				},
			},
			{
				name: 'List External Transactions',
				value: 'listExternalTransactions',
				action: 'List external transactions',
				description: 'List transactions on connected (Plaid/Finicity) external accounts',
				routing: {
					request: { method: 'GET', url: '/external-transactions' },
					output: listOutput,
				},
			},
			{
				name: 'List Transfers',
				value: 'listTransfers',
				action: 'List transfers',
				description: 'List transfers for one or more accounts',
				routing: {
					request: { method: 'GET', url: '/transfers' },
					output: listOutput,
				},
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
