const PRODUCTION_URL = 'https://api.concero.io/api'
const DEBUG_URL = process.env.CONCERO_API_URL
export const BASE_URL = process.env.DEBUG === 'true' ? DEBUG_URL : PRODUCTION_URL
