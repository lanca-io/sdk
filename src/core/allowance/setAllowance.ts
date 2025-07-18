import type { Address, EncodeFunctionDataReturnType } from 'viem'
import type { Chain } from 'viem'
import type { Client } from 'viem'
import type { Hash } from 'viem'
import { erc20Abi } from 'viem'
import { encodeFunctionData } from 'viem'
import { sendTransaction } from 'viem/actions'
import { getAction } from 'viem/utils'
import { isZeroAddress } from '../../utils/isZeroAddress'
import { getAllowance } from './getAllowance'

export const setAllowance = async (
	client: Client,
	chain: Chain,
	tokenAddress: Address,
	contractAddress: Address,
	amount: bigint,
): Promise<Hash> => {
	const data: EncodeFunctionDataReturnType = encodeFunctionData({
		abi: erc20Abi,
		functionName: 'approve',
		args: [contractAddress, amount],
	})

	return getAction(
		client,
		sendTransaction,
		'sendTransaction',
	)({
		account: client.account!,
		data: data,
		to: tokenAddress,
		chain: chain,
	})
}

export const setTokenAllowance = async (
	client: Client,
	chain: Chain,
	tokenAddress: Address,
	spender: Address,
	amount: bigint,
): Promise<Hash | undefined> => {
	if (isZeroAddress(tokenAddress)) return

	const approvedAmmount: bigint = await getAllowance(client, tokenAddress, client.account!.address, spender)
	if (amount > approvedAmmount) {
		const txHash: Hash = await setAllowance(client, chain, tokenAddress, spender, amount)
		return txHash
	}

	return
}
