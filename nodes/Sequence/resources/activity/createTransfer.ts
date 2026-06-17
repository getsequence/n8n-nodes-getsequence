import type { INodeProperties } from 'n8n-workflow';

const show = { operation: ['createTransfer'], resource: ['activity'] };

export const activityCreateTransferDescription: INodeProperties[] = [
	{
		displayName: 'Source Account ID',
		name: 'sourceAccountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'Account to transfer from',
	},
	{
		displayName: 'Destination Account ID',
		name: 'destinationAccountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'Account to transfer to',
	},
	{
		displayName: 'Amount (Cents)',
		name: 'amountInCents',
		type: 'number',
		required: true,
		default: 100,
		typeOptions: { minValue: 100 },
		displayOptions: { show },
		description: 'Amount to transfer in cents. Minimum 100 ($1.00).',
	},
	{
		displayName: 'Statement Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show },
		// qmd 0010: the API hard-caps this at 10 chars (ACH/NACHA constraint), letters/digits/spaces only.
		description:
			'Short ACH label shown on the bank statement. Max 10 characters, letters/digits/spaces only.',
	},
	{
		displayName: 'Simulation (Dry Run)',
		name: 'simulation',
		type: 'boolean',
		default: true,
		displayOptions: { show },
		description:
			'Whether to simulate the transfer without moving real money. On by default for safety; turn off to move real money. The response is marked executionMode SIMULATION when on.',
	},
	{
		displayName:
			'Simulation is OFF - running this node will move REAL money. The response executionMode will be LIVE.',
		name: 'liveTransferWarning',
		type: 'notice',
		default: '',
		displayOptions: { show: { ...show, simulation: [false] } },
	},
	{
		displayName: 'Idempotency Key',
		name: 'idempotencyKey',
		type: 'string',
		default: '',
		displayOptions: { show },
		description:
			'Deduplicates retries within 24h. Reusing a key returns the original result instead of moving money twice. Leave blank to auto-generate a stable key per item. Max 36 chars.',
	},
];
