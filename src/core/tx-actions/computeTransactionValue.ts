import type { Address } from 'viem'
import type { Client } from 'viem'
import { readContract } from 'viem/actions'
import { globalErrorHandler } from '../../errors'
import { conceroAbiV2 as v2ABI } from '../../abi'
import { zeroAddress } from 'viem'
import { isNative } from '../../utils'

export const computeTransactionValue = async (
	client: Client,
	contractAddress: Address,
	tokenAddress: Address,
	selector: bigint,
	amount: bigint,
	isTestnet: boolean,
): Promise<bigint> => {
	const isNativeToken = isNative(tokenAddress)

	switch (true) {
		case isNativeToken:
			return amount
		case isTestnet:
			return await estimateV2TransactionValue(client, contractAddress, selector, amount)
		default:
			return 0n
	}
}

const estimateV2TransactionValue = async (
	client: Client,
	contractAddress: Address,
	selector: bigint,
	amount: bigint,
): Promise<bigint> => {
	if (!client || !contractAddress || !selector || !amount) {
		throw Error('Failed to estimamte V2 tx value, due to missing params')
	}

	try {
		const value = (await readContract(client, {
			address: contractAddress,
			abi: v2ABI,
			functionName: 'getFee',
			args: [selector, amount, zeroAddress, 1000000],
		})) as bigint

		return value
	} catch (e) {
		throw globalErrorHandler.parse(e)
	}
}
