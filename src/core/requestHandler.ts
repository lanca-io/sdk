import { defaultRetryCount, defaultTimeInterval } from "../constants"
import { sleep } from "../utils"
import { globalErrorHandler, HTTPError } from "../errors"

export class RequestHandler {
    private baseUrl: string
    private apiKey: string
    private readonly maxRetryCount: number

    constructor(baseUrl: string, apiKey?: string, maxRetryCount: number = defaultRetryCount) {
        this.baseUrl = baseUrl
        this.apiKey = apiKey
        this.maxRetryCount = maxRetryCount
    }

    public async makeRequest<T = Response>(url: RequestInfo | URL, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            "x-lanca-version": "1.0.0", // SDK version
            "x-lanca-integrator": "lanca-sdk", // Integrator name
        }

        if (this.apiKey) {
            headers["x-lanca-api-key"] = this.apiKey
        }

        options.headers = { ...options.headers, ...headers }

        let response: Response
        let retryCount = 0
        while (retryCount < this.maxRetryCount) {
            try {
                response = await fetch(this.baseUrl + url, options)
                if (response.ok) {
                    break
                }
            } catch (error) {
                globalErrorHandler.handle(error)
            }
            retryCount++
            await sleep(defaultTimeInterval)
        }

        if (!response.ok) {
            throw new HTTPError('Request failed', response, url, options)
        }

        return await response.json()
    }
}