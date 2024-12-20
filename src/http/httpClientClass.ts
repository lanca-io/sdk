import { DEFAULT_REQUEST_RETRY_INTERVAL_MS, DEFAULT_RETRY_COUNT } from '../constants'
import { globalErrorHandler, HTTPError } from '../errors'
import { UrlType } from '../types'
import { sleep } from '../utils'

export class HttpClient {
	private apiKey: string
	private readonly maxRetryCount: number

	constructor(apiKey: string = '', maxRetryCount: number = DEFAULT_RETRY_COUNT) {
		this.apiKey = apiKey
		this.maxRetryCount = maxRetryCount
	}

	public async request<T = Response>(url: UrlType, options: RequestInit = {}): Promise<T> {
		const headers: Record<string, string> = {
			'x-lanca-version': '1.0.0', // SDK version
			'x-lanca-integrator': 'lanca-sdk', // Integrator name
		}

		if (this.apiKey) {
			headers['x-lanca-api-key'] = this.apiKey
		}

		options.headers = { ...options.headers, ...headers }

		let response: Response | null = null
		let retryCount = 0
		while (retryCount < this.maxRetryCount) {
			try {
				response = await fetch(url, options)
				if (response.ok) {
					break
				}
			} catch (error) {
				globalErrorHandler.handle(error)
			}
			retryCount++
			await sleep(DEFAULT_REQUEST_RETRY_INTERVAL_MS)
		}
		if (response && !response.ok) {
			throw new HTTPError('Request failed', response, url, options)
		}

		return await response!.json()
	}

	public async get<T = Response>(url: UrlType, options: RequestInit | URLSearchParams = {}): Promise<T> {
		if (options instanceof URLSearchParams) {
			url += `?${options.toString()}`
			options = {}
		}
		return this.request<T>(url, { ...options, method: 'GET' })
	}

	public async post<T = Response>(url: UrlType, options: RequestInit = {}): Promise<T> {
		return this.request<T>(url, { ...options, method: 'POST' })
	}
}