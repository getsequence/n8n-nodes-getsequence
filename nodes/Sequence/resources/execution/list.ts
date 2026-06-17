import type { INodeProperties } from 'n8n-workflow';
import { dateRangeFilters, returnAllAndLimit } from '../shared';

const show = { operation: ['list'], resource: ['execution'] };

export const executionListDescription: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'The rule whose executions to list',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: '',
		displayOptions: { show },
		options: [
			{ name: 'Any', value: '' },
			{ name: 'Executed', value: 'EXECUTED' },
			{ name: 'Failed', value: 'FAILED' },
			{ name: 'In Progress', value: 'IN_PROGRESS' },
			{ name: 'Partial', value: 'PARTIAL' },
		],
	},
	{
		displayName: 'Trigger Type',
		name: 'triggerType',
		type: 'options',
		default: '',
		displayOptions: { show },
		options: [
			{ name: 'Any', value: '' },
			{ name: 'On Funds Transferred', value: 'ON_FUNDS_TRANSFERRED' },
			{ name: 'On-Demand', value: 'MANUAL' },
			{ name: 'Scheduled', value: 'SCHEDULED' },
			{ name: 'Sequence API', value: 'SEQUENCE_API' },
		],
	},
	{
		displayName: 'Execution Mode',
		name: 'executionMode',
		type: 'options',
		default: 'ALL',
		displayOptions: { show },
		description: 'ALL returns both real and dry-run executions; LIVE only real; SIMULATION only dry-runs',
		options: [
			{ name: 'All', value: 'ALL' },
			{ name: 'Live', value: 'LIVE' },
			{ name: 'Simulation', value: 'SIMULATION' },
		],
	},
	...dateRangeFilters(show),
	...returnAllAndLimit(show),
];
