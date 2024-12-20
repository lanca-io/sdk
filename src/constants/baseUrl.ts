const PRODUCTION_URL = 'https://api.concero.io/api'
const LOCAL_URL = 'http://127.0.0.1:4000/api'
export const BASE_URL = process.env.DEBUG ? LOCAL_URL : PRODUCTION_URL
