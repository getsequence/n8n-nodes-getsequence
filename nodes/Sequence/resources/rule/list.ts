import type { INodeProperties } from 'n8n-workflow';
import { returnAllAndLimit } from '../shared';

const show = { operation: ['list'], resource: ['rule'] };

export const ruleListDescription: INodeProperties[] = [
	{
		displayName: 'Source Account ID',
		name: 'sourceId',
		type: 'string',
		default: '',
		displayOptions: { show },
		description: 'Optional: filter rules by their source account ID',
	},
	...returnAllAndLimit(show),
];
