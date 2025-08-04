import type { Client } from 'viem'
import type { Address } from 'viem'
import { erc20Abi } from 'viem'
import { getAction } from 'viem/utils'
import { getBalance } from 'viem/actions'
import { readContract } from 'viem/actions'

export const getTokenBalance = async (client: Client, tokenAddress: Address): Promise<bigint> => {
	if (!client.account?.address) {
		return 0n
	}
	return getAction(
		client,
		readContract,
		'readContract',
	)({
		account: client.account,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: [client.account.address],
		address: tokenAddress,
	})
}

export const getNativeBalance = async (client: Client): Promise<bigint> => {
	if (!client.account?.address) {
		return 0n
	}

	return getAction(
		client,
		getBalance,
		'getBalance',
	)({
		address: client.account?.address,
	})
}
