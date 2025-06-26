<div align="center">

[![license](https://img.shields.io/badge/license-ISC-blue)](ISC)
[![npm latest package](https://img.shields.io/npm/v/@lanca/sdk/latest.svg)](https://www.npmjs.com/package/@lanca/sdk)

</div>

<h1 align="center">LANCA SDK</h1>

[**LANCA SDK**](https://docs.lanca.io/getting-started) is a comprehensive toolkit for developers that enables seamless interaction with cross-chain swaps, bridging, and single-chain swaps. Currently, we support five EVM-compatible networks: Optimism, Base, Arbitrum, Polygon, and Avalanche. With LANCA SDK, you can easily discover optimal routes for swaps, whether they are single-chain, cross-chain, or bridge-based transactions.

Key features include:

- Route Discovery & Execution: Effortlessly find the best routes for swaps across chains, bridges, and single-chain swaps, then execute transactions directly from your app.
- Token & Chain Support: Retrieve a list of supported tokens and chains, ensuring you're always working with the most up-to-date ecosystem.
- Transaction Tracking: Keep track of transaction statuses by hash, offering complete transparency throughout the process.
- Efficient Bundle Management: LANCA SDK uses rollups and tree-shaking to minimize bundle sizes, ensuring fast load times and optimal performance in front-end environments.
- Complete Documentation: Our SDK is fully documented, making it easier for developers to integrate and customize according to specific project needs.
- Flexible Integration: With customizable settings, you can tailor the SDK to your application, whether it's managing RPC configurations or controlling which chains, tokens, and bridges to support.
- Built for performance and scalability, LANCA SDK is the ideal solution for creating powerful, cross-chain experiences, with a focus on speed, security, and developer ease of use.

## Installation

```bash
npm i @lanca/sdk
```

or

```bash
pnpm add @lanca/sdk
```

or

```bash
yarn add @lanca/sdk
```

or

```bash
bun i @lanca/sdk
```

## Quick Start

### Creating a Configuration

To use the Lanca SDK, you need to create a configuration object. Here is an example of a basic configuration:

```ts
import { LancaClient } from '@lanca/sdk'
import type { ILancaClientConfig, IChainWithProvider } from '@lanca/sdk'
import { createWalletClient } from 'viem'
import { polygon, base } from 'viem/chains'

const config: ILancaClientConfig = {
	integratorAddress: 'YOUR_INTEGRATOR_ADDRESS',
	feeBps: 1n,
	chains: {
		'137': {
			chain: polygon,
			provider: http(),
		},
		'8453': {
			chain: base,
			provider: http(),
		},
	} as Record<string, IChainWithProvider>,
}
```

Replace `YOUR_INTEGRATOR_ADDRESS` with your actual integrator address.

Set `feeBps` as the desired fee rate in basis points (bps).

### Creating a LancaClient

To use the Lanca SDK, you need to create a LancaClient object. Here is an example of a basic usage:

```ts
const lancaClient = new LancaClient(config)
```

### Request a route

To request a route for token exchange, please provide the addresses of the two tokens, their network IDs, the amount of the first token, and the slippage percentage. For example, you can request a route by specifying the token addresses, network IDs, amount, and slippage, and our SDK will provide you with the optimal route for the exchange.

```ts
const route = await lancaClient.getRoute({
	fromChainId: '137', // polygon
	toChainId: '8453', //  base
	fromToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // USDC
	toToken: '0x4200000000000000000000000000000000000006', //WETH
	amount: '1000000', // 1 USDC in machine-readable format
	fromAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
	toAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
	slippageTolerance: '0.5',
})
```

### Execute a route

To execute a route for token exchange, please provide the obtained route data and our SDK will handle the exchange process for you. Simply pass the route data to the LancaSDK object and it will execute the exchange according to the provided parameters.

```ts
const walletClient = createWalletClient({
	chain: polygon,
	transport: custom(window.ethereum!),
})

const executionConfig: IExecutionConfig = {
	switchChainHook: async (chainId: number) => {
		console.log(chainId)
	},
	updateRouteStatusHook: (route: IRouteType) => console.log(route),
}

const routeWithStatus = await lancaClient.executeRoute(route, walletClient, executionConfig)
```

### Track route status

To track the status of a route for token exchange, you can use the `getRouteStatus` method of the LancaClient object. This method allows you to retrieve the current status of the route, including any updates or changes that have occurred during the exchange process.

```ts
const routeStatus = await lancaClient.getRouteStatus(
	'0x231b5f78e90bf71996fd65a05c93a0d0fdb562a2cd8eb6944a833c80bae39b3e',
)
```

This is just a basic example to get you started. For more information on the Lanca SDK and its features, please refer to the rest of the documentation.

## Documentation

Please checkout the [SDK documentation](https://docs.lanca.io/) for further information.

## License

This project is licensed under the terms of the ISC.
