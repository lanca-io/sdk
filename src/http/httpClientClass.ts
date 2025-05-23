import type { IErrorWithMessage } from '../errors'
import type { UrlType } from '../types'
import { DEFAULT_REQUEST_RETRY_INTERVAL_MS, DEFAULT_RETRY_COUNT } from '../constants'
import { globalErrorHandler, HTTPError, LancaClientError } from '../errors'
import { sleep } from '../utils'

export class HttpClient {
	private readonly apiKey: string
	private readonly maxRetryCount: number

	/**
	 * Constructs a new instance of the HttpClient class.
	 * @param apiKey - The API key that will be included in the "Authorization" header of all requests.
	 * @param maxRetryCount - The maximum number of times a request will be retried in case of failure. Defaults to DEFAULT_RETRY_COUNT.
	 */
	constructor(apiKey: string = '', maxRetryCount: number = DEFAULT_RETRY_COUNT) {
		this.apiKey = apiKey
		this.maxRetryCount = maxRetryCount
	}

	/**
	 * Performs a request to the given URL with the given options.
	 * @param url - The URL of the request.
	 * @param options - The options of the request.
	 * @returns The response of the request, or throws an error if the request fails.
	 *
	 * The request is retried in case of network errors, with a default retry count of 3 and a retry interval of 3 seconds.
	 * If the request fails with a status code between 400 and 500, the error is parsed and handled by the global error handler.
	 * If the request fails with a status code outside of this range, the error is handled by the global error handler and then re-thrown.
	 */
	public async request<T = Response>(url: UrlType, options: RequestInit = {}): Promise<T> {
		const headers: Record<string, string> = {
			'x-lanca-version': '1.0.0', // SDK version
			'x-lanca-integrator': 'lanca-sdk', // Integrator name
			'Content-Type': 'application/json',
			Accept: 'application/json',
		}

		if (this.apiKey) {
			headers['x-lanca-api-key'] = this.apiKey
		}

		options.headers = { ...options.headers, ...headers }

		let response: Response | null = null
		let retryCount = 0
		let lancaError: LancaClientError | HTTPError | null = null
		while (retryCount < this.maxRetryCount) {
			try {
				response = await fetch(url, {
					...options,
					credentials: 'include',
				})
				if (response.ok) {
					return await response.json()
				}

				const errorResponse = await response.json()

				if (response.status >= 400 && response.status < 500) {
					lancaError = globalErrorHandler.parse(errorResponse)
					await globalErrorHandler.handle(lancaError)
					break
				}
			} catch (error) {
				if (this.isNetworkError(error)) {
					console.warn(`Network error occurred. Retrying... (${retryCount++}/${this.maxRetryCount})`)
				}
				await globalErrorHandler.handle(error)
			}

			if (response?.status) retryCount++
			await sleep(DEFAULT_REQUEST_RETRY_INTERVAL_MS)
		}

		throw lancaError
	}

	/**
	 * Sends an HTTP GET request to the specified URL with the provided options.
	 *
	 * @template T - The expected return type of the response.
	 * @param url - The URL to send the GET request to.
	 * @param options - Optional request options or URL parameters.
	 *                   If a URLSearchParams object is provided, it will be appended to the URL as query parameters.
	 * @returns A promise that resolves to the response of type T.
	 */
	public async get<T = Response>(url: UrlType, options: RequestInit | URLSearchParams = {}): Promise<T> {
		if (options instanceof URLSearchParams) {
			url += `?${options.toString()}`
			options = {}
		}
		return this.request<T>(url, { ...options, method: 'GET' })
	}

	/**
	 * Sends an HTTP POST request to the specified URL with the provided options.
	 *
	 * @template T - The expected return type of the response.
	 * @param url - The URL to send the POST request to.
	 * @param options - Optional request options or payload.
	 * @returns A promise that resolves to the response of type T.
	 */
	public async post<T = Response>(url: UrlType, options: RequestInit = {}): Promise<T> {
		return this.request<T>(url, { ...options, method: 'POST' })
	}

	/**
	 * Checks if the given error is a network error.
	 * @param error The error to be checked.
	 * @returns True if the error is a network error, false otherwise.
	 */
	private isNetworkError(error: unknown): boolean {
		return (
			error instanceof TypeError ||
			(error as IErrorWithMessage)?.message.includes('NetworkError') ||
			(error as IErrorWithMessage)?.message.includes('failed to fetch')
		)
	}
}
