export interface ConceroToken {
	address: string;
	chainId: string;
	decimals: number;
	logo_url: string;
	name: string;
	symbol: string;
}

export interface ConceroChain {
	chain_id: string;
	name: string;
	logo_url: string;
}

export interface ConceroDirection {
	token: ConceroToken;
	amount: string;
	amount_usd?: string;
}

export interface ConceroRouteDirection extends ConceroDirection {
	chain: ConceroChain;
}

export interface ConceroStepDirection extends ConceroDirection {
	chainId: string;
}

export enum FeeTypes {
	gas = "gas",
	fee = "fee",
}

export interface GasFee {
	amount: string;
	amount_usd: string;
	type: FeeTypes;
	token: ConceroToken;
}

type SwapType = "bridge" | "swap";

export interface ConceroRouteStep {
	from: ConceroStepDirection;
	to: ConceroStepDirection;
	tool: {
		name: string;
		type: SwapType;
		logo_url: string;
		execution_time_seconds?: number;
		fees: GasFee[];
		address: string;
		additional_info?: Record<string, any>;
	};
}

export interface RouteData {
	from: ConceroRouteDirection;
	to: ConceroRouteDirection;
	steps: ConceroRouteStep[];
}

export interface Route {
	success: boolean;
	data: RouteData;
}

export interface IGetRoute {
	fromToken: string;
	toToken: string;
	fromChainId: string;
	toChainId: string;
	amount: string;
	slippageTolerance: string;
}

export interface IGetTokens {
	chainId: string;
	name?: string;
	symbol?: string;
	limit?: string;
}
