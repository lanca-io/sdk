import { DEFAULT_REQUEST_RETRY_INTERVAL_MS, DEFAULT_RETRY_COUNT } from '../constants'
import { globalErrorHandler, HTTPError } from '../errors'
import { ErrorWithMessage } from '../errors/types'
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
					return await response.json()
				}

				if (!this.shouldRetry(response)) {
					throw new HTTPError('Request failed', response, url, options)
				}
			} catch (error) {
				if (this.isNetworkError(error)) {
					console.warn(`Network error occurred. Retrying... (${retryCount++}/${this.maxRetryCount})`)
				}
				globalErrorHandler.handle(error)
			}

			if (response?.status) retryCount++
			await sleep(DEFAULT_REQUEST_RETRY_INTERVAL_MS)
		}
		if (response && !response.ok) {
			throw new HTTPError('Request failed', response, url, options)
		}

		throw new Error('Unexpected error occurred')
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

	/**
	 * Returns true if the response status is 500 or greater, but less than 600, indicating that the request should be retried.
	 * @param response The response object from the request.
	 */
	private shouldRetry(response: Response) {
		const { status } = response
		return status >= 500 && status < 600
	}

	/**
	 * Checks if the given error is a network error.
	 * @param error The error to be checked.
	 * @returns True if the error is a network error, false otherwise.
	 */
	private isNetworkError(error: unknown): boolean {
		return (
			error instanceof TypeError ||
			(error as ErrorWithMessage)?.message.includes('NetworkError') ||
			(error as ErrorWithMessage)?.message.includes('failed to fetch')
		)
	}
}
