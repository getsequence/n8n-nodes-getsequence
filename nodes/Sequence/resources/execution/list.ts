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
			{ name: 'Manual', value: 'MANUAL' },
			{ name: 'On Funds Transferred', value: 'ON_FUNDS_TRANSFERRED' },
			{ name: 'Remote API', value: 'REMOTE_API' },
			{ name: 'Scheduled', value: 'SCHEDULED' },
			{ name: 'Sequence API', value: 'SEQUENCE_API' },
		],
	},
	{
		displayName: 'Execution Mode',
		name: 'executionMode',
		type: 'options',
		default: 'LIVE',
		displayOptions: { show },
		description: 'LIVE returns real executions; SIMULATION returns dry-runs; ALL returns both',
		options: [
			{ name: 'All', value: 'ALL' },
			{ name: 'Live', value: 'LIVE' },
			{ name: 'Simulation', value: 'SIMULATION' },
		],
	},
	...dateRangeFilters(show),
	...returnAllAndLimit(show),
];
