import type { INodeProperties } from 'n8n-workflow';
import { returnAllAndLimit } from '../shared';

const show = { operation: ['list'], resource: ['account'] };

export const accountListDescription: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		default: '',
		displayOptions: { show },
		options: [
			{ name: 'Any', value: '' },
			{ name: 'External Account', value: 'EXTERNAL_ACCOUNT' },
			{ name: 'Income Source', value: 'INCOME_SOURCE' },
			{ name: 'Pod', value: 'POD' },
		],
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'options',
		default: 'ACTIVE',
		displayOptions: { show },
		description: 'ACTIVE excludes deleted accounts; ALL includes them',
		options: [
			{ name: 'Active', value: 'ACTIVE' },
			{ name: 'All', value: 'ALL' },
		],
	},
	...returnAllAndLimit(show),
];
