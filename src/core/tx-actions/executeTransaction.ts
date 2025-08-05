import type { Abi, Address, Client, EncodeFunctionDataReturnType, Hash } from 'viem'
import { conceroAbiV1_7 as mainnetABI } from '../../abi'
import { conceroAbiV2 as testnetABI } from '../../abi'
import { encodeFunctionData } from 'viem'
import { estimateGas } from '../gas-estimation'
import { computeTransactionValue } from './computeTransactionValue'
import { getAction } from 'viem/utils'
import { sendTransaction } from 'viem/actions'

export const executeTransaction = async (
	client: Client,
	contractAddress: Address,
	tokenAddress: Address,
	selector: bigint,
	amount: bigint,
	functionName: string,
	args: unknown[],
	isTestnet: boolean,
): Promise<Hash> => {
	if (!client.account) {
		throw new Error('Failed to get the account from the client')
	}

	const abi: Abi = isTestnet ? testnetABI : mainnetABI
	const value: bigint = await computeTransactionValue(
		client,
		contractAddress,
		tokenAddress,
		selector,
		amount,
		isTestnet,
	)
	const gas: bigint = await estimateGas(client, contractAddress, abi, functionName, args)
	const data: EncodeFunctionDataReturnType = encodeFunctionData({
		abi: abi,
		functionName: functionName,
		args: args,
	})

	return getAction(
		client,
		sendTransaction,
		'sendTransaction',
	)({
		account: client.account,
		data: data,
		to: contractAddress,
		chain: client.chain,
		value: value,
		gas: gas,
	})
}
