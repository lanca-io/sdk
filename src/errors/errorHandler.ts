import pino, { Logger } from 'pino'
import { BaseError } from './lancaErrors'

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
	public async handle(error: unknown | BaseError) {
		if (error instanceof BaseError) {
			this.logger.error(`[ConceroError] ${error.message}`)
		} else if (error instanceof Error) {
			this.logger.error(`[Error] ${error.message}`)
		} else {
			this.logger.error(`[UnknownError] ${error}`)
		}
		await this.sendErrorReport(error)
	}

	/**
	 * Sends an error report to the Concero API. If the logger's level is not set to 'error', this method does nothing.
	 * @param error The error to be reported.
	 */
	private async sendErrorReport(error: BaseError) {
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