import type { INodeProperties } from 'n8n-workflow';

const show = { operation: ['trigger'], resource: ['rule'] };

export const ruleTriggerDescription: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'The rule ID to trigger',
	},
	{
		displayName: 'Execute Amount (Cents)',
		name: 'executeAmount',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show },
		description:
			'Optional amount in cents injected as TRANSFER_AMOUNT. Drives percentage/round_down/top_up actions; ignored by fixed-amount transfers. Leave 0 to use current balances.',
		routing: {
			send: { type: 'body', property: 'executeAmount', value: '={{ $value || undefined }}' },
		},
	},
	{
		displayName: 'Simulation (Dry Run)',
		name: 'simulation',
		type: 'boolean',
		default: true,
		displayOptions: { show },
		description:
			'Whether to simulate the rule run without moving real money. On by default for safety; turn off to let the rule move real money.',
		routing: { send: { type: 'body', property: 'simulation' } },
	},
	{
		displayName:
			'Simulation is OFF — triggering this rule may move REAL money. Generated transfers will be LIVE.',
		name: 'liveTriggerWarning',
		type: 'notice',
		default: '',
		displayOptions: { show: { ...show, simulation: [false] } },
	},
	{
		displayName: 'Idempotency Key',
		name: 'idempotencyKey',
		type: 'string',
		default: '={{ $execution.id + "-" + $itemIndex }}',
		displayOptions: { show },
		description: 'Deduplicates retries within 24h. Max 36 chars.',
	},
];
