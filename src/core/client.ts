import {
    ConceroChain,
    ConceroToken,
    IGetRoute,
    IGetTokens,
    RouteData,
} from "../types/route";
import { baseUrl } from "../constants/baseUrl";

export class ConceroClient {
    constructor(
        private feeTier: number,
        private integratorId: string,
    ) { }

    public async getRoute({
        fromChainId,
        toChainId,
        fromToken,
        toToken,
        amount,
        slippageTolerance = "0.5",
    }: IGetRoute): Promise<RouteData | undefined> {
        const url = new URL(`${baseUrl}/route`);
        try {
            url.searchParams.append("fromChainId", fromChainId.toString());
            url.searchParams.append("toChainId", toChainId.toString());
            url.searchParams.append("fromToken", fromToken);
            url.searchParams.append("toToken", toToken);
            url.searchParams.append("amount", amount.toString());
            url.searchParams.append(
                "slippageTolerance",
                slippageTolerance.toString(),
            );

            const response = await fetch(url);
            if (response.status !== 200) {
                throw new Error(await response.text());
            }
            const route = await response.json();
            return route?.data;
        } catch (error) {
            console.error(error);
        }
    }

    //parseError метод - пробрасывать ошибку

    // public executeRoute(route: Route, options: ExecuteRouteOptions) {

    // }

    public async getSupportedChains(): Promise<ConceroChain[] | undefined> {
        const url = new URL(`${baseUrl}/chains`);

        try {
            const response = await fetch(url);
            if (response.status !== 200) {
                throw new Error(await response.text());
            }
            const chains = await response.json();
            return chains?.data;
        } catch (error) {
            console.error(error);
        }
    }

    public async getSupportedTokens({
        chainId,
        name,
        symbol,
        limit = "10000000",
    }: IGetTokens): Promise<ConceroToken[] | undefined> {
        const url = new URL(`${baseUrl}/tokens`);
        url.searchParams.append("chainId", chainId);
        url.searchParams.append("limit", limit);
        if (name) {
            url.searchParams.append("name", name);
        }
        if (symbol) {
            url.searchParams.append("symbol", symbol);
        }
        try {
            const response = await fetch(url);
            if (response.status !== 200) {
                throw new Error(await response.text());
            }
            const tokens = await response.json();
            return tokens?.data;
        } catch (error) {
            console.error(error);
        }
    }
    // public getRouteStatus(routeId: string) { }
}
