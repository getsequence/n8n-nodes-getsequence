import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

type ShowCondition = NonNullable<IDisplayOptions['show']>;

/**
 * Standard "Return All" + "Limit" + "Page" controls for Sequence list endpoints.
 * Execution logic (paging at pageSize 100 for Return All, or a single Page/Limit
 * page otherwise) lives in router.ts — these are UI-only.
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
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 50,
			typeOptions: { minValue: 1, maxValue: 100 },
			displayOptions: { show: { ...show, returnAll: [false] } },
			description: 'Max number of results to return',
		},
		{
			displayName: 'Page',
			name: 'page',
			type: 'number',
			default: 1,
			typeOptions: { minValue: 1 },
			displayOptions: { show: { ...show, returnAll: [false] } },
			description:
				'Which 1-based page to fetch. Use with a Loop/Wait combination to paginate manually.',
		},
	];
}

/** Shared transfer list filters: direction, status, execution mode, origin, rule execution. */
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
				{ name: 'Internal', value: 'INTERNAL' },
				{ name: 'Money In', value: 'MONEY_IN' },
				{ name: 'Money Out', value: 'MONEY_OUT' },
			],
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
		},
		{
			displayName: 'Execution Mode',
			name: 'executionMode',
			type: 'options',
			default: 'LIVE',
			displayOptions: { show },
			description: 'Which transfers to return. LIVE is real money; SIMULATION is dry-run only.',
			options: [
				{ name: 'All', value: 'ALL' },
				{ name: 'Live', value: 'LIVE' },
				{ name: 'Simulation', value: 'SIMULATION' },
			],
		},
		{
			displayName: 'Origin',
			name: 'origin',
			type: 'options',
			default: '',
			displayOptions: { show },
			options: [
				{ name: 'Any', value: '' },
				{ name: 'Cashback', value: 'CASHBACK' },
				{ name: 'Check Deposit', value: 'CHECK_DEPOSIT' },
				{ name: 'Direct Deposit', value: 'DIRECT_DEPOSIT' },
				{ name: 'External Pull', value: 'EXTERNAL_PULL' },
				{ name: 'Rule', value: 'RULE' },
				{ name: 'User', value: 'USER' },
				{ name: 'User Pull', value: 'USER_PULL' },
			],
		},
		{
			displayName: 'Rule Execution ID',
			name: 'ruleExecutionId',
			type: 'string',
			default: '',
			displayOptions: { show },
			description: 'Filter to transfers produced by a specific rule execution',
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
		},
		{
			displayName: 'To',
			name: 'to',
			type: 'dateTime',
			default: '',
			displayOptions: { show },
			description: 'Return records created at or before this timestamp',
		},
	];
}
