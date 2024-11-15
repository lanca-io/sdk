import pino, { Logger } from 'pino'
import { LancaSDKError } from './errors'

export class ErrorHandler {
    private logger: Logger
    private destinationReport: string //for the future use
    private apiUrl: string //for the future use

    /**
     * Initializes a new instance of the ErrorHandler class.
     * 
     * @param level - The logging level for the logger. Defaults to 'error' if not provided.
     */
    constructor(level?: string) {
        this.logger = pino({
            name: 'lanca-sdk',
            level: level ?? 'error',
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    //destination: './logs/lanca-sdk.log',
                },
            },
        })
    }

    /**
     * Handles the given error and sends an error report to the Concero API if the logger's level is set to 'error'.
     * @param error The error to be handled.
     */
    public async handle(error: unknown | LancaSDKError) {
        if (error instanceof LancaSDKError) {
            this.parseLancaSDKError(error)
        } else if (error instanceof Error) {
            this.logger.error(`[LancaSDKError] [Error] ${error.message}`)
        } else {
            this.logger.error(`[LancaSDKError] [UnknownError] ${error}`)
        }
        await this.sendErrorReport(error)
    }

    /**
     * Parses the given LancaSDKError and logs it with a human-readable prefix.
     * The prefix is '[LancaSDKError]' followed by one of the following:
     * - '[TokenNotSupported]' if the error is a TokenNotSupportedError
     * - '[ChainNotSupported]' if the error is a ChainNotSupportedError
     * - '[UnknownError]' otherwise
     * @param error The error to be parsed and logged.
     */
    private parseLancaSDKError(error: LancaSDKError) {
        let prefix = '[LancaSDKError]'
        if (error.message.includes('Token not supported')) {
            prefix += ' [TokenNotSupported]'
        } else if (error.message.includes('Chain not supported')) {
            prefix += ' [ChainNotSupported]'
        } else {
            prefix += ' [UnknownError]'
        }
        this.logger.error(`${prefix} ${error.message}`)
    }

    /**
     * Sends an error report to the Concero API. If the logger's level is not set to 'error', this method does nothing.
     * @param error The error to be reported.
     */
    private async sendErrorReport(error: LancaSDKError) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    errorName: error.errorName,
                    message: error.message,
                    cause: error.cause,
                }),
            })
            this.logger.info(`Error report sent successfully: ${response.status}`)
        } catch (err) {
            this.logger.error(`Error sending error report: ${err.message}`);
        }
    }
}