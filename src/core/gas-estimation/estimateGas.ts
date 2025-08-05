import type { Abi, Address, Client, EstimateContractGasParameters } from 'viem'
import { computeGasConsumption } from './computeGas'
import { ADDITIONAL_GAS_PERCENTAGE } from '../../constants'
import { globalErrorHandler } from '../../errors'

export const estimateGas = async (
	client: Client,
	contractAddress: Address,
	abi: Abi,
	functionName: string,
	args: unknown[] = [],
	value: bigint = 0n,
): Promise<bigint> => {
	try {
		const parameters: EstimateContractGasParameters = {
			account: client.account,
			address: contractAddress,
			abi: abi,
			functionName: functionName,
			args: args,
			value: value,
		}

		const gas = await computeGasConsumption(client, parameters)
		const adjustedGas = (gas * BigInt(100 + ADDITIONAL_GAS_PERCENTAGE)) / 100n
		return adjustedGas
	} catch (e) {
		throw globalErrorHandler.parse(e)
	}
}
