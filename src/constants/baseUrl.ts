const PRODUCTION_URL = 'https://api.concero.io/api'
const DEBUG_URL = process.env.CONCERO_API_URL
const isDebug = process.env.DEBUG?.toLowerCase() === 'true'

if (isDebug && !DEBUG_URL) {
	console.warn('⚠️  Warning: DEBUG mode is enabled, but CONCERO_API_URL is not set! Using PRODUCTION_URL.')
}

export const BASE_URL = isDebug && DEBUG_URL ? DEBUG_URL : PRODUCTION_URL
