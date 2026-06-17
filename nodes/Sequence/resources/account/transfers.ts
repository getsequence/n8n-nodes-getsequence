import type { INodeProperties } from 'n8n-workflow';
import { dateRangeFilters, returnAllAndLimit, transferFilters } from '../shared';

const show = { operation: ['transfers'], resource: ['account'] };

export const accountTransfersDescription: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'The account whose transfers to list',
	},
	{
		displayName: 'Account Role',
		name: 'accountRole',
		type: 'options',
		default: 'either',
		displayOptions: { show },
		description: 'Match the account as the source, the destination, or either',
		options: [
			{ name: 'Destination', value: 'destination' },
			{ name: 'Either', value: 'either' },
			{ name: 'Source', value: 'source' },
		],
	},
	...transferFilters(show),
	...dateRangeFilters(show),
	...returnAllAndLimit(show),
];
