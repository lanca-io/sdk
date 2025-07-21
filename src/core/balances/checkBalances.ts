import type { Client } from 'viem'
import type { Address } from 'viem'
import { getTokenBalance } from './getBalances'
import { getNativeBalance } from './getBalances'

export const checkNativeBalance = async (client: Client, amount: bigint): Promise<boolean> => {
	const balance: bigint = await getNativeBalance(client)
	return balance >= amount
}

export const checkTokenBalance = async (client: Client, tokenAddress: Address, amount: bigint): Promise<boolean> => {
	const balance: bigint = await getTokenBalance(client, tokenAddress)
	return balance >= amount
}
