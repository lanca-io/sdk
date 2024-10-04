import {
	ConceroChain,
	ConceroRouteStep,
	ConceroToken,
	IGetRoute,
	IGetTokens,
	RouteData,
} from "../types/route";
import { baseUrl } from "../constants/baseUrl";
import {
	EmptyAmountError,
	RouteError,
	TokensAreTheSameError,
	UnsupportedChainError,
	UnsupportedTokenError,
	WalletClientError,
} from "../errors";
import {
	type Address,
	createPublicClient,
	encodeAbiParameters,
	parseUnits,
	PublicClient,
	WalletClient,
} from "viem";
import {
	ExecuteRouteStage,
	ExecuteRouteStatus,
	ExecutionConfigs,
	InputRouteData,
	InputSwapData,
} from "../types";
import { conceroAddressesMap } from "../configs";
import { checkAllowanceAndApprove } from "./checkAllowanceAndApprove";
import { BridgeData } from "../types";
import { uniswapV3RouterAddressesMap } from "../constants/uniswapV3RouterAddressesMap";
import { dexTypesMap } from "../constants";
import { sendTransaction } from "./sendTransaction";
import { ConceroConfig } from "../types";
import { defaultRpcsConfig } from "../configs/defaultRpcsConfig";
import { TransactionTracker } from "./TransactionTracker";

export class ConceroClient {
	private config: ConceroConfig;
	constructor(config: ConceroConfig) {
		this.config = config;
		if (!this.config.chains) {
			this.config.chains = defaultRpcsConfig;
		}
	}

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
			this.parseError(error);
		}
	}

	public async executeRoute(
		route: RouteData,
		executionConfigs: ExecutionConfigs,
	) {
		//const { updateStateHook } = executionConfigs;
		try {
			await this.executeRouteBase(route, executionConfigs);
		} catch (error) {
			console.error(error);

			//updateStateHook({})

			if (error.toString().toLowerCase().includes("user rejected")) {
				return;
			}

			const { txHash } = error.data;
		}
	}

	private async executeRouteBase(
		route: RouteData,
		executionConfigs: ExecutionConfigs,
	) {
		const { walletClient, chains } = this.config;
		if (!walletClient)
			throw new WalletClientError("Wallet client not initialized");

		this.validateRoute(route);
		const { switchChainHook, updateStateHook } = executionConfigs;

		updateStateHook([
			{
				stage: ExecuteRouteStage.SwitchChain,
				status: ExecuteRouteStatus.Pending,
			},
			{
				stage: ExecuteRouteStage.Allowance,
				status: ExecuteRouteStatus.NotStarted,
			},
			{
				stage: ExecuteRouteStage.Swap,
				status: ExecuteRouteStatus.NotStarted,
			},
		]);

		if (!switchChainHook) {
			await walletClient.switchChain({
				id: Number(route.to.chain.id),
			});
		} else {
			await switchChainHook(Number(route.from.chain.id));
		}

		const [clientAddress] = await walletClient.requestAddresses();

		const inputRouteData: InputRouteData = this.buildRouteData(
			route,
			clientAddress,
		);
		const conceroAddress = conceroAddressesMap[route.from.chain.id];

		const publicClient = createPublicClient({
			chain: route.from.chain.id,
			transport: chains[route.from.chain.id],
		});

		await checkAllowanceAndApprove(
			walletClient,
			publicClient,
			route.from,
			clientAddress,
            updateStateHook
		);
		const hash = await sendTransaction(
			inputRouteData,
			publicClient,
			walletClient,
			conceroAddress,
			clientAddress,
		);
		await TransactionTracker.checkTransactionStatus(
			hash,
			publicClient,
			/*callback,*/
			route,
			conceroAddress,
			clientAddress,
		);
		return hash;
	}

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
			//console.error(error);
			this.parseError(error);
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
			//console.error(error);
			this.parseError(error);
		}
	}

	private parseError(error: unknown) {
		if (error instanceof Error) {
			const errorMessage = error.message;
			if (errorMessage === "Token not supported") {
				throw new UnsupportedTokenError(errorMessage);
			} else if (errorMessage === "Chain not supported") {
				throw new UnsupportedChainError(errorMessage);
			}
		}
	}

	private validateRoute(route: RouteData) {
		if (!route) throw new RouteError("Route not initialized");
		if (route.to.amount === "0" || route.to.amount === "")
			throw new EmptyAmountError(route.to.amount);
		if (
			route.from.token.address === route.to.token.address &&
			route.from.chain?.id === route.to.chain?.id
		)
			throw new TokensAreTheSameError(route.from.token.address);
	}

	private buildRouteData(routeData: RouteData, clientAddress: Address) {
		const { steps } = routeData;
		let bridgeData: BridgeData | null = null;
		const srcSwapData: InputSwapData[] = [];
		const dstSwapData: InputSwapData[] = [];
		steps.forEach(step => {
			const { from, to, tool } = step;
			const { type } = step.tool;

			const fromAmount = parseUnits(from.amount, from.token.decimals);
			const toAmount = parseUnits(to.amount, to.token.decimals);

			if (type === "bridge") {
				bridgeData = {
					tokenType: 1,
					amount: fromAmount,
					dstChainSelector: BigInt(conceroAddressesMap[to.chainId]),
					receiver: clientAddress,
				};
			} else if (type === "swap") {
				const dexData = this.buildDexData(step);
				const swapData: InputSwapData = {
					dexType: dexTypesMap[tool.name],
					fromToken: from.token.address as Address,
					fromAmount,
					toToken: to.token.address as Address,
					toAmount,
					toAmountMin: parseUnits(
						tool.additional_info.outputAmountMin,
						to.token.decimals,
					),
					dexData,
				};

				if (bridgeData) dstSwapData.push(swapData);
				else srcSwapData.push(swapData);
			}
		});
		return { srcSwapData, bridgeData, dstSwapData };
	}

	private buildDexData(step: ConceroRouteStep): Address | undefined {
		switch (step.tool.name) {
			case "uniswapV3Multi":
				return this.encodeRouteStepUniswapV3Multi(step);
			case "uniswapV3Single":
				return this.encodeRouteStepUniswapV3Single(step);
			case "wrapNative":
				return "0x";
			case "unwrapNative":
				return encodeAbiParameters(
					[{ type: "address" }],
					[uniswapV3RouterAddressesMap[step.from.chainId]],
				);
		}
	}

	private encodeRouteStepUniswapV3Multi(step: ConceroRouteStep) {
		return encodeAbiParameters(
			[{ type: "address" }, { type: "bytes" }, { type: "uint256" }],
			[
				uniswapV3RouterAddressesMap[step.from.chainId],
				step.tool.additional_info.tokenPath,
				BigInt(step.tool.additional_info.deadline),
			],
		);
	}

	private encodeRouteStepUniswapV3Single(step: ConceroRouteStep) {
		return encodeAbiParameters(
			[
				{ type: "address" },
				{ type: "uint24" },
				{ type: "uint160" },
				{ type: "uint256" },
			],
			[
				uniswapV3RouterAddressesMap[step.from.chainId],
				step.tool.additional_info.fee,
				0n,
				BigInt(step.tool.additional_info.deadline),
			],
		);
	}

	// public getRouteStatus(routeId: string) { }
}
