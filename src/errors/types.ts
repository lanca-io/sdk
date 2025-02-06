export interface IErrorWithMessage {
	message: string
}

export enum RoutingErrorType {
	CHAIN_NOT_SUPPORTED = 'CHAIN_NOT_SUPPORTED',
	NO_ROUTE_FOUND = 'NO_ROUTE_FOUND',
	TOKEN_NOT_SUPPORTED = 'TOKEN_NOT_SUPPORTED',
	TOO_LOW_AMOUNT = 'TOO_LOW_AMOUNT',
	TOO_HIGH_AMOUNT = 'TOO_HIGH_AMOUNT',
	UNKNOWN_ERROR = 'UNKNOWN_ERROR',
	MISSING_PARAMS = 'MISSING_PARAMS',
	WRONG_SLIPPAGE = 'WRONG_SLIPPAGE',
	WRONG_AMOUNT = 'WRONG_AMOUNT',
	AMOUNT_BELOW_FEE = 'AMOUNT_BELOW_FEE',
	SAME_TOKENS = 'SAME_TOKENS',
}

export interface IRoutingErrorParams {
	type: RoutingErrorType
	[key: string]: string | number | string[] | undefined
}
