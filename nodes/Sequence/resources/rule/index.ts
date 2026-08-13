import type { INodeProperties } from 'n8n-workflow';
import { ruleListDescription } from './list';
import { ruleGetDescription } from './get';
import { ruleTriggerDescription } from './trigger';

const showOnlyForRules = { resource: ['rule'] };

export const ruleDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForRules },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a rule',
				description: 'Get a rule with its steps, conditions, and actions',
			},
			{
				name: 'Get Many',
				value: 'list',
				action: 'List rules',
				description: 'List rules (compact summary)',
			},
			{
				name: 'Trigger',
				value: 'trigger',
				action: 'Trigger a rule',
				description: 'Run a rule on demand (supports dry-run simulation)',
			},
		],
		default: 'list',
	},
	...ruleListDescription,
	...ruleGetDescription,
	...ruleTriggerDescription,
];
