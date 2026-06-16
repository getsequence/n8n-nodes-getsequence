import type { INodeProperties } from 'n8n-workflow';
import { itemOutput, listOutput } from '../shared';
import { accountListDescription } from './list';
import { accountGetDescription } from './get';
import { accountTransfersDescription } from './transfers';

const showOnlyForAccounts = { resource: ['account'] };

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForAccounts },
		options: [
			{
				name: 'Get Many',
				value: 'list',
				action: 'List accounts',
				description: 'List income sources, pods, and external accounts',
				routing: {
					request: { method: 'GET', url: '/accounts' },
					output: listOutput,
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an account',
				description: 'Get a single account with balance',
				routing: {
					request: { method: 'GET', url: '=/accounts/{{$parameter.accountId}}' },
					output: itemOutput,
				},
			},
			{
				name: 'List Transfers',
				value: 'transfers',
				action: 'List transfers for an account',
				description: 'List transfers where this account is the source or destination',
				routing: {
					request: { method: 'GET', url: '=/accounts/{{$parameter.accountId}}/transfers' },
					output: listOutput,
				},
			},
		],
		default: 'list',
	},
	...accountListDescription,
	...accountGetDescription,
	...accountTransfersDescription,
];
