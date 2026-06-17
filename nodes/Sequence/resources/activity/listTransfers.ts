import type { INodeProperties } from 'n8n-workflow';
import { dateRangeFilters, returnAllAndLimit, transferFilters } from '../shared';

const show = { operation: ['listTransfers'], resource: ['activity'] };

export const activityListTransfersDescription: INodeProperties[] = [
	{
		displayName: 'Account IDs',
		name: 'accountIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description:
			'Comma-separated account IDs. Returns transfers where the source or destination matches any of them. Each must be in the key\'s READ_TRANSFERS resources.',
	},
	...transferFilters(show),
	...dateRangeFilters(show),
	...returnAllAndLimit(show),
];
