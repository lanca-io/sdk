import { DEFAULT_REQUEST_RETRY_INTERVAL_MS, DEFAULT_RETRY_COUNT } from '../constants'
import { globalErrorHandler, HTTPError, LancaClientError } from '../errors'
import { ErrorWithMessage } from '../errors/types'
import { UrlType } from '../types'
import { sleep } from '../utils'

export class HttpClient {
	private apiKey: string
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
				response = await fetch(url, options)
				if (response.ok) {
					return await response.json()
				}

				const errorResponse = await response.json()

				if (response.status >= 400 && response.status < 500) {
					lancaError = globalErrorHandler.parse(errorResponse)
					globalErrorHandler.handle(lancaError)
					break
				}

				if (!this.shouldRetry(response)) {
					globalErrorHandler.handle(errorResponse.error as string)
					lancaError = new HTTPError('Request failed', response, url, options)
					break
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
