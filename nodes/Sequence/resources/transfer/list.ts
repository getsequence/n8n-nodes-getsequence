import type { INodeProperties } from 'n8n-workflow';
import { dateRangeFilters, returnAllAndLimit, transferFilters } from '../shared';

const show = { operation: ['list'], resource: ['transfer'] };

export const transferListDescription: INodeProperties[] = [
	{
		displayName: 'Account IDs',
		name: 'accountIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description:
			'Comma-separated account IDs. Returns transfers where the source or destination matches any of them. Each must be in the key\'s READ_TRANSFERS resources.',
		routing: {
			send: {
				type: 'query',
				property: 'accountIds',
				value: '={{ $value.split(",").map((s) => s.trim()).filter((s) => s) }}',
			},
		},
	},
	...transferFilters(show),
	...dateRangeFilters(show),
	...returnAllAndLimit(show),
];
