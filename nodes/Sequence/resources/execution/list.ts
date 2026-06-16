import type { INodeProperties } from 'n8n-workflow';
import { returnAllAndLimit } from '../shared';

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
		displayName: 'Execution Mode',
		name: 'executionMode',
		type: 'options',
		default: 'LIVE',
		displayOptions: { show },
		description: 'LIVE returns real executions; SIMULATION returns dry-runs; ALL returns both',
		options: [
			{ name: 'Live', value: 'LIVE' },
			{ name: 'Simulation', value: 'SIMULATION' },
			{ name: 'All', value: 'ALL' },
		],
		routing: { send: { type: 'query', property: 'executionMode' } },
	},
	...returnAllAndLimit(show),
];
