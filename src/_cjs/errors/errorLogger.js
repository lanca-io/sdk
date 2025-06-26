Object.defineProperty(exports, '__esModule', { value: true })
exports.ErrorLogger = void 0
const lancaErrors_1 = require('./lancaErrors')
const stringifyWithBigInt_1 = require('../utils/stringifyWithBigInt')
const pino_1 = require('pino')
class ErrorLogger {
  logger
  constructor(name = 'lanca-sdk', level = 'error') {
    this.logger = (0, pino_1.default)({
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
  error(error) {
    switch (true) {
      case error instanceof lancaErrors_1.LancaClientError:
        this.logger.error(error.toString())
        break
      case error instanceof Error:
        this.logger.error(error.message)
        break
      default:
        this.logger.error((0, stringifyWithBigInt_1.stringifyWithBigInt)(error))
        break
    }
  }
  info(message) {
    this.logger.info(message)
  }
  warn(message) {
    this.logger.warn(message)
  }
  debug(message) {
    this.logger.debug(message)
  }
}
exports.ErrorLogger = ErrorLogger
//# sourceMappingURL=errorLogger.js.map
