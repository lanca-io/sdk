import pino from 'pino'
// import { destination } from 'pino'

export const logger = pino({
    name: 'concero-sdk',
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            //destination: './logs/concero-sdk.log',
        },
    },
})