import type { INodeProperties } from 'n8n-workflow';
import { itemOutput, listOutput } from '../shared';
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
				name: 'Get Many',
				value: 'list',
				action: 'List rules',
				description: 'List rules (compact summary)',
				routing: {
					request: { method: 'GET', url: '/rules' },
					output: listOutput,
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a rule',
				description: 'Get a rule with its steps, conditions, and actions',
				routing: {
					request: { method: 'GET', url: '=/rules/{{$parameter.ruleId}}' },
					output: itemOutput,
				},
			},
			{
				name: 'Trigger',
				value: 'trigger',
				action: 'Trigger a rule',
				description: 'Run a rule on demand (supports dry-run simulation)',
				routing: {
					request: {
						method: 'POST',
						url: '=/rules/{{$parameter.ruleId}}/trigger',
						headers: { 'idempotency-key': '={{ $parameter.idempotencyKey || undefined }}' },
					},
					output: itemOutput,
				},
			},
		],
		default: 'list',
	},
	...ruleListDescription,
	...ruleGetDescription,
	...ruleTriggerDescription,
];
