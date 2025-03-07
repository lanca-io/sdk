const PRODUCTION_URL = 'https://api.concero.io/api';
const DEBUG_URL = typeof process !== 'undefined' && process.env.CONCERO_API_URL ? process.env.CONCERO_API_URL : PRODUCTION_URL;
const DEBUG = typeof process !== 'undefined' && process.env.DEBUG === 'true';

export const BASE_URL = DEBUG ? DEBUG_URL : PRODUCTION_URL;