import { zeroAddress } from "viem";
import { ConceroClient } from "../src/core/client";

describe("ConceroClient", () => {
    let client: ConceroClient;
    beforeEach(() => {
        client = new ConceroClient({
            integratorId: '1',
            feeTier: 1000,
            chains: {
                '8453': ['https://rpc.ankr.com/eth'],
                '137': ['https://polygon-rpc.com'],
            }
        });
    })

    describe("getRoute", () => {
        it("getRoute", async () => {
            const route = await client.getRoute({
                fromChainId: "8453",
                toChainId: "137",
                fromToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                toToken: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
                amount: "100000000",
                slippageTolerance: "0.5",
            });
            expect(route).toBeDefined();
            //console.log(route);
        });

        it("getRoute fails with unsupported chainId", async () => {
            const unsupportedChainId = "9999";
            const route = await client.getRoute({
                fromChainId: unsupportedChainId,
                toChainId: "137",
                fromToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                toToken: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
                amount: "1",
                slippageTolerance: "0.5",
            });
            expect(route).toBeUndefined();
        });

        it("getRoute fails with unsupported tokens", async () => {
            const unsupportedTokenFrom = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
            const unsupportedTokenTo = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
            const route = await client.getRoute({
                fromChainId: "1",
                toChainId: "137",
                fromToken: unsupportedTokenFrom,
                toToken: unsupportedTokenTo,
                amount: "1",
                slippageTolerance: "0.5",
            });
            expect(route).toBeUndefined();
        });
    });

    describe("getTokens", () => {
        it("getTokens with chainId", async () => {
            const tokens = await client.getSupportedTokens({
                chainId: "137"
            });
            expect(tokens).toBeDefined();
            expect(tokens?.length).toBeGreaterThan(0);
            //console.log(tokens);
        });

        it("getTokens with symbol", async () => {
            const tokens = await client.getSupportedTokens({
                chainId: "137", symbol: "ETH"
            });
            expect(tokens).toBeDefined();
            expect(tokens?.length).toBeGreaterThan(0);
            //console.log(tokens);
        });

        it("getTokens with name", async () => {
            const tokens = await client.getSupportedTokens({
                chainId: "137", name: "USD Coin"
            });
            expect(tokens).toBeDefined();
            expect(tokens?.length).toBeGreaterThan(0);
            //console.log(tokens);
        });
    });


    describe("getChains", () => {
        it("getChains", async () => {
            const chains = await client.getSupportedChains();
            expect(chains).toBeDefined();
            expect(chains?.length).toBeGreaterThan(0);
            //console.log(chains);
        });
    });

})