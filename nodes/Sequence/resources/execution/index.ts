import type { INodeProperties } from 'n8n-workflow';
import { itemOutput, listOutput } from '../shared';
import { executionListDescription } from './list';
import { executionGetDescription } from './get';

const showOnlyForExecutions = { resource: ['execution'] };

export const executionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForExecutions },
		options: [
			{
				name: 'Get Many',
				value: 'list',
				action: 'List rule executions',
				description: 'List executions for a rule',
				routing: {
					request: { method: 'GET', url: '=/rules/{{$parameter.ruleId}}/executions' },
					output: listOutput,
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a rule execution',
				description: 'Get a single rule execution with its outcome and transfer IDs',
				routing: {
					request: {
						method: 'GET',
						url: '=/rules/{{$parameter.ruleId}}/executions/{{$parameter.executionId}}',
					},
					output: itemOutput,
				},
			},
		],
		default: 'list',
	},
	...executionListDescription,
	...executionGetDescription,
];
