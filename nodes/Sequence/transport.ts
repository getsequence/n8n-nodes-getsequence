import {
	sleep,
	type IDataObject,
	type IExecuteFunctions,
	type IHttpRequestMethods,
	type IHttpRequestOptions,
} from 'n8n-workflow';

const MAX_RETRIES = 5;
const DEFAULT_RETRY_WAIT_MS = 1000;

interface SequenceResponse {
	data: IDataObject & { items?: IDataObject[]; pagination?: { hasNextPage?: boolean } };
	requestId?: string;
}

function statusOf(error: unknown): number | undefined {
	const e = error as {
		httpCode?: unknown;
		statusCode?: unknown;
		response?: { statusCode?: unknown; status?: unknown };
	};
	const raw = e?.httpCode ?? e?.response?.statusCode ?? e?.response?.status ?? e?.statusCode;
	const code = Number(raw);
	return Number.isNaN(code) ? undefined : code;
}

function retryAfterMs(error: unknown): number {
	const e = error as { response?: { headers?: Record<string, unknown> } };
	const headers = e?.response?.headers ?? {};
	const seconds = Number(headers['retry-after'] ?? headers['Retry-After']);
	return !Number.isNaN(seconds) && seconds > 0 ? seconds * 1000 : DEFAULT_RETRY_WAIT_MS;
}

/**
 * Single authenticated request with simple backoff: retries 429, 5xx, and
 * network errors up to MAX_RETRIES, honoring the server's Retry-After on 429.
 * The Sequence rate limiter is a 100-token bucket refilling ~1.67/s and returns
 * Retry-After (usually ~1s), so honoring it is sufficient — no exponential math.
 * Throws the original error to the caller, which wraps it in a NodeApiError.
 */
export async function sequenceApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
	headers?: IDataObject,
): Promise<SequenceResponse> {
	const credentials = await this.getCredentials('sequenceApi');
	const baseUrl = String(credentials.baseUrl).replace(/\/+$/, '');

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		json: true,
	};
	if (qs && Object.keys(qs).length > 0) options.qs = qs;
	if (body && Object.keys(body).length > 0) options.body = body;
	if (headers && Object.keys(headers).length > 0) options.headers = headers;

	let lastError: unknown;
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			return (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'sequenceApi',
				options,
			)) as SequenceResponse;
		} catch (error) {
			lastError = error;
			const status = statusOf(error);
			const retriable = status === 429 || status === undefined || (status >= 500 && status < 600);
			if (!retriable || attempt === MAX_RETRIES) break;
			await sleep(status === 429 ? retryAfterMs(error) : DEFAULT_RETRY_WAIT_MS);
		}
	}
	throw lastError;
}

/** Walks every page (at the max pageSize of 100) and returns the flattened items. */
export async function sequenceApiRequestAllItems(
	this: IExecuteFunctions,
	endpoint: string,
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const items: IDataObject[] = [];
	let page = 1;
	while (true) {
		const response = await sequenceApiRequest.call(this, 'GET', endpoint, undefined, {
			...qs,
			page,
			pageSize: 100,
		});
		const data = response?.data ?? {};
		if (Array.isArray(data.items)) items.push(...data.items);
		if (data.pagination?.hasNextPage !== true) break;
		page += 1;
	}
	return items;
}
