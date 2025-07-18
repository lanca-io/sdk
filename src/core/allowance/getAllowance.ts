import type { Address, Client } from 'viem'
import type { ReadContractReturnType } from 'viem'
import { erc20Abi } from 'viem'
import { readContract } from 'viem/actions'
import { getPublicClient } from '../../utils'
import { isZeroAddress } from '../../utils/isZeroAddress'

export const getAllowance = async (
	client: Client,
	tokenAddress: Address,
	owner: Address,
	spender: Address,
): Promise<bigint> => {
	try {
		const result = await readContract(client, {
			address: tokenAddress,
			abi: erc20Abi,
			functionName: 'allowance',
			args: [owner, spender],
		})
		return result
	} catch (_) {
		return 0n
	}
}

export const getTokenAllowance = async (
	chainId: number,
	tokenAddress: Address,
	owner: Address,
	spender: Address,
): Promise<ReadContractReturnType> => {
	if (isZeroAddress(tokenAddress) || isZeroAddress(owner) || isZeroAddress(spender)) return 0n
	const client = await getPublicClient(chainId)
	const approved = await getAllowance(client, tokenAddress, owner, spender)
	return approved
}
