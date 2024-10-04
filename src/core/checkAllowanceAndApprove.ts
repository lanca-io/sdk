import {
	Address,
	erc20Abi,
	parseUnits,
	PublicClient,
	WalletClient,
	zeroAddress,
} from "viem";
import { SwapDirectionData } from "../types/tx";
import { conceroAddressesMap } from "../configs";
import { ExecuteRouteInfo, ExecuteRouteStage, ExecuteRouteStatus, UpdateRouteHook } from "../types";

export async function checkAllowanceAndApprove(
	walletClient: WalletClient,
	publicClient: PublicClient,
	txData: SwapDirectionData,
	clientAddress: Address,
	updateStateHook: UpdateRouteHook
) {
	const { token, amount, chain } = txData;
	if (token.address === zeroAddress) {
		return;
	}

	if (!chain) {
		return;
	}

	const currentState: Array<ExecuteRouteInfo> = [
		{
			stage: ExecuteRouteStage.SwitchChain,
			status: ExecuteRouteStatus.Success,
		},
		{
			stage: ExecuteRouteStage.Allowance,
			status: ExecuteRouteStatus.Pending,
		},
		{
			stage: ExecuteRouteStage.Swap,
			status: ExecuteRouteStatus.NotStarted,
		},
	];

	{
		switchChain: ExecuteRouteStatus.Success,
		allowance: ExecuteRouteStatus.Pending,
		swap: ExecuteRouteStatus.NotStarted,
		txLink: null,
	}

	updateStateHook(currentState);

	const conceroAddress = conceroAddressesMap[chain.id];
	const allowance = await publicClient.readContract({
		abi: erc20Abi,
		functionName: "allowance",
		address: token.address as `0x${string}`,
		args: [clientAddress, conceroAddress],
	});

	let approveTxHash = null;
	const amountInDecimals = parseUnits(amount, token.decimals);

	currentState[1].status = ExecuteRouteStatus.Success;
	updateStateHook(currentState);


	if (allowance < amountInDecimals) {
		const { request } = await publicClient.simulateContract({
			account: clientAddress,
			address: token.address as `0x${string}`,
			abi: erc20Abi,
			functionName: "approve",
			args: [conceroAddress, amountInDecimals],
		});

		approveTxHash = await walletClient.writeContract(request);
	}

	if (approveTxHash) {
		await publicClient.waitForTransactionReceipt({ hash: approveTxHash });
		updateStateHook([
			{
				stage: ExecuteRouteStage.SwitchChain,
				status: ExecuteRouteStatus.Success,
			},
			{
				stage: ExecuteRouteStage.Allowance,
				status: ExecuteRouteStatus.Success,
			},
			{
				stage: ExecuteRouteStage.Swap,
				status: ExecuteRouteStatus.NotStarted,
			},
		]);
	}
	else {
		updateStateHook([
			{
				stage: ExecuteRouteStage.SwitchChain,
				status: ExecuteRouteStatus.Success,
			},
			{
				stage: ExecuteRouteStage.Allowance,
				status: ExecuteRouteStatus.Success,
			},
			{
				stage: ExecuteRouteStage.Swap,
				status: ExecuteRouteStatus.NotStarted,
			},
		]);
	}



}
