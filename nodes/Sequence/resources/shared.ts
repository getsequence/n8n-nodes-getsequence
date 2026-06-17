import type { IDisplayOptions, INodeProperties, INodeRequestOutput } from 'n8n-workflow';

type ShowCondition = NonNullable<IDisplayOptions['show']>;

/**
 * Unwraps the Sequence `{ data: { items, pagination }, requestId }` envelope
 * down to the `items` array. Chained rootProperty steps avoid relying on
 * dotted-path support.
 */
export const listOutput: INodeRequestOutput = {
	postReceive: [
		{ type: 'rootProperty', properties: { property: 'data' } },
		{ type: 'rootProperty', properties: { property: 'items' } },
	],
};

/** Unwraps the envelope of a single-object response down to `data`. */
export const itemOutput: INodeRequestOutput = {
	postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }],
};

/**
 * Standard "Return All" + "Limit" pair for Sequence list endpoints, which
 * paginate by 1-based `page` / `pageSize` and report `data.pagination.hasNextPage`.
 */
export function returnAllAndLimit(show: ShowCondition): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			displayOptions: { show },
			description: 'Whether to return all results or only up to a given limit',
			routing: {
				send: {
					paginate: '={{ $value }}',
					// Page through at the max page size (100) to minimize round-trips and rate-limit pressure.
					type: 'query',
					property: 'pageSize',
					value: '={{ $value ? 100 : undefined }}',
				},
				operations: {
					pagination: {
						type: 'generic',
						properties: {
							continue: '={{ $response.body.data.pagination.hasNextPage === true }}',
							request: {
								qs: {
									// page is a string once pagination kicks in — coerce before incrementing.
									page: '={{ (Number($request.qs.page) || 1) + 1 }}',
								},
							},
						},
					},
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 50,
			typeOptions: { minValue: 1, maxValue: 100 },
			displayOptions: { show: { ...show, returnAll: [false] } },
			description: 'Max number of results to return',
			routing: {
				send: { type: 'query', property: 'pageSize' },
				output: { maxResults: '={{ $value }}' },
			},
		},
	];
}

const optionalQuery = (property: string) => ({
	send: { type: 'query' as const, property, value: '={{ $value || undefined }}' },
});

/** Shared transfer list filters: direction, status, execution mode, origin. */
export function transferFilters(show: ShowCondition): INodeProperties[] {
	return [
		{
			displayName: 'Direction',
			name: 'direction',
			type: 'options',
			default: '',
			displayOptions: { show },
			options: [
				{ name: 'Any', value: '' },
				{ name: 'Money In', value: 'MONEY_IN' },
				{ name: 'Money Out', value: 'MONEY_OUT' },
				{ name: 'Internal', value: 'INTERNAL' },
			],
			routing: optionalQuery('direction'),
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			default: '',
			displayOptions: { show },
			options: [
				{ name: 'Any', value: '' },
				{ name: 'Cancelled', value: 'CANCELLED' },
				{ name: 'Complete', value: 'COMPLETE' },
				{ name: 'Error', value: 'ERROR' },
				{ name: 'Incomplete', value: 'INCOMPLETE' },
				{ name: 'Pending', value: 'PENDING' },
				{ name: 'Pending Approval', value: 'PENDING_APPROVAL' },
				{ name: 'Processing', value: 'PROCESSING' },
			],
			routing: optionalQuery('status'),
		},
		{
			displayName: 'Execution Mode',
			name: 'executionMode',
			type: 'options',
			default: 'LIVE',
			displayOptions: { show },
			description: 'Which transfers to return. LIVE is real money; SIMULATION is dry-run only.',
			options: [
				{ name: 'Live', value: 'LIVE' },
				{ name: 'Simulation', value: 'SIMULATION' },
				{ name: 'All', value: 'ALL' },
			],
			routing: optionalQuery('executionMode'),
		},
	];
}

/** Optional `from` / `to` RFC 3339 date-range query filters. */
export function dateRangeFilters(show: ShowCondition): INodeProperties[] {
	return [
		{
			displayName: 'From',
			name: 'from',
			type: 'dateTime',
			default: '',
			displayOptions: { show },
			description: 'Return records created at or after this timestamp',
			// Omit the param entirely when left blank.
			routing: { send: { type: 'query', property: 'from', value: '={{ $value || undefined }}' } },
		},
		{
			displayName: 'To',
			name: 'to',
			type: 'dateTime',
			default: '',
			displayOptions: { show },
			description: 'Return records created at or before this timestamp',
			routing: { send: { type: 'query', property: 'to', value: '={{ $value || undefined }}' } },
		},
	];
}
