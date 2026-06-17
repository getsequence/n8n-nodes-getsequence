import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class SequenceApi implements ICredentialType {
	name = 'sequenceApi';

	displayName = 'Sequence API';

	icon: Icon = 'file:sequence.svg';

	documentationUrl = 'https://app.getsequence.io/api/platform/';

	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'baseUrl',
			type: 'options',
			options: [
				{ name: 'Production', value: 'https://api.getsequence.io/platform/v1' },
				{ name: 'Staging', value: 'https://staging.getsequence.io/api/platform/v1' },
				{ name: 'Dev', value: 'https://dev.getsequence.io/api/platform/v1' },
				{ name: 'Local', value: 'http://localhost:4000/platform/v1' },
			],
			default: 'https://api.getsequence.io/platform/v1',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'A Sequence API key (begins with sk_). Scope it to the operations this node uses.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				// Attribution header the API records in its audit log.
				'x-called-reason': 'n8n',
			},
		},
	};

	// READ_ACCOUNTS is the lightest scope to verify a key with.
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/accounts',
			qs: { pageSize: 1 },
		},
	};
}
