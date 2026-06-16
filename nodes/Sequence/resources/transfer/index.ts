import type { INodeProperties } from 'n8n-workflow';
import { itemOutput, listOutput } from '../shared';
import { transferCreateDescription } from './create';
import { transferListDescription } from './list';
import { transferGetDescription } from './get';

const showOnlyForTransfers = { resource: ['transfer'] };

export const transferDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTransfers },
		options: [
			{
				name: 'Create',
				value: 'create',
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
				name: 'Get Many',
				value: 'list',
				action: 'List transfers',
				description: 'List transfers for one or more accounts',
				routing: {
					request: { method: 'GET', url: '/transfers' },
					output: listOutput,
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a transfer',
				description: 'Get a single transfer by ID',
				routing: {
					request: { method: 'GET', url: '=/transfers/{{$parameter.transferId}}' },
					output: itemOutput,
				},
			},
		],
		default: 'create',
	},
	...transferCreateDescription,
	...transferListDescription,
	...transferGetDescription,
];
