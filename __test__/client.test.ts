import { createWalletClient, http } from 'viem'
import { ConceroClient } from '../src/core/client'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// @review add execute route test (swap, bridge, swapAndBridge)

describe('ConceroClient', () => {
	let client: ConceroClient
	beforeEach(() => {
		client = new ConceroClient({
			integratorId: '1',
			feeTier: 1000,
			chains: {
				'8453': ['https://rpc.ankr.com/eth'],
				'137': ['https://polygon-rpc.com'],
			},
		})
	})


	describe('executeRoute', () => {
		let route, walletClient, account
		beforeEach(async () => {
			route = await client.getRoute({
				fromChainId: '8453',
				toChainId: '8453',
				fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',//USDC
				toToken: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',//DAI
				amount: '1',
				slippageTolerance: '0.5',
			})

			account = privateKeyToAccount(process.env.PRIVATE_KEY)
			walletClient = createWalletClient({
				account,
				chain: base,
				transport: http(),
			})


		})
		it('test_canSwapSingleChain', async () => {
			console.log('route', route)
			const txHash = await client.executeRoute(route, walletClient, {
				switchChainHook: (chainId: number) => {
					console.log('switchChainHook chainId', chainId)
				},
				updateRouteStatusHook: (routeStatus) => {
					console.log(routeStatus)
				}
			})

			const routeStatus = await client.getRouteStatus(txHash)
			console.log(routeStatus)
		})
	})


	describe('getRoute', () => {
		it('test_canGetRoute', async () => {
			const route = await client.getRoute({
				fromChainId: '8453',
				toChainId: '137',
				fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
				toToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
				amount: '100000000',
				slippageTolerance: '0.5',
			})
			expect(route).toBeDefined()
			//console.log(route);
		})

		it('test_failsWithUnsupportedChain', async () => {
			const unsupportedChainId = '9999'
			const route = await client.getRoute({
				fromChainId: unsupportedChainId,
				toChainId: '137',
				fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
				toToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
				amount: '1',
				slippageTolerance: '0.5',
			})
			expect(route).toBeUndefined()
		})

		it('test_failsWithUnsupportedToken', async () => {
			const unsupportedTokenFrom = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
			const unsupportedTokenTo = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
			const route = await client.getRoute({
				fromChainId: '1',
				toChainId: '137',
				fromToken: unsupportedTokenFrom,
				toToken: unsupportedTokenTo,
				amount: '1',
				slippageTolerance: '0.5',
			})
			expect(route).toBeUndefined()
		})
	})

	describe('getTokens', () => {
		it('test_canGetTokensWithChainId', async () => {
			const tokens = await client.getSupportedTokens({
				chainId: '137',
			})
			expect(tokens).toBeDefined()
			expect(tokens?.length).toBeGreaterThan(0)
			//console.log(tokens);
		})

		it('test_canGetTokensWithSymbol', async () => {
			const tokens = await client.getSupportedTokens({
				chainId: '137',
				symbol: 'ETH',
			})
			expect(tokens).toBeDefined()
			expect(tokens?.length).toBeGreaterThan(0)
			//console.log(tokens);
		})

		it('test_canGetTokensWithNameAndChainId', async () => {
			const tokens = await client.getSupportedTokens({
				chainId: '137',
				name: 'USD Coin',
			})
			expect(tokens).toBeDefined()
			expect(tokens?.length).toBeGreaterThan(0)
			//console.log(tokens);
		})
	})

	describe('getChains', () => {
		it('test_canGetChains', async () => {
			const chains = await client.getSupportedChains()
			expect(chains).toBeDefined()
			expect(chains?.length).toBeGreaterThan(0)
			//console.log(chains);
		})
	})
})
