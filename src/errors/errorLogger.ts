import type { Logger } from 'pino'
import { LancaClientError } from './lancaErrors'
import { stringifyWithBigInt } from '../utils/stringifyWithBigInt'
import pino from 'pino'

export class ErrorLogger {
	private logger: Logger

	constructor(name: string = 'lanca-sdk', level: string = 'error') {
		this.logger = pino({
			name,
			level,
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
				},
			},
		})
	}

	public error(error: unknown): void {
		switch (true) {
			case error instanceof LancaClientError:
				this.logger.error((error as LancaClientError).toString())
				break
			case error instanceof Error:
				this.logger.error((error as Error).message)
				break
			default:
				this.logger.error(stringifyWithBigInt(error))
				break
		}
	}

	public info(message: string): void {
		this.logger.info(message)
	}

	public warn(message: string): void {
		this.logger.warn(message)
	}

	public debug(message: string): void {
		this.logger.debug(message)
	}
}
