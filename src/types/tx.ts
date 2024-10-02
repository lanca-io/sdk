import { ConceroChain, ConceroToken } from "./route";

export interface SwapDirectionData {
	token: ConceroToken;
	chain?: ConceroChain;
	chainId: string;
	amount: string;
	amount_usd?: string;
}
