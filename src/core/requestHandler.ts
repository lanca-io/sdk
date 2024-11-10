import { defaultRetryCount } from "../constants"

export class RequestHandler {
    private baseUrl: string
    private apiKey: string
    private retryCount: number

    constructor(baseUrl: string, apiKey?: string, retryCount?: number = defaultRetryCount) {
        this.baseUrl = baseUrl
        this.apiKey = apiKey
        this.retryCount = retryCount
    }

    public async function makeRequest() {

    }
}