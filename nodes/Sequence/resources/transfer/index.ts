import type { INodeProperties } from 'n8n-workflow';
import { transferCreateDescription } from './create';
import { transferGetDescription } from './get';
import { transferListDescription } from './list';

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
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a transfer',
				description: 'Get a single transfer by ID',
			},
			{
				name: 'Get Many',
				value: 'list',
				action: 'List transfers',
				description: 'List transfers for one or more accounts',
			},
		],
		default: 'list',
	},
	...transferCreateDescription,
	...transferGetDescription,
	...transferListDescription,
];
