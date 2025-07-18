import type { Client } from 'viem'
import type { EstimateContractGasParameters } from 'viem'
import type { EncodeFunctionDataReturnType } from 'viem'
import { encodeFunctionData } from 'viem'
import { getAction } from 'viem/utils'
import { estimateGas } from 'viem/actions'

export const computeGasConsumption = async (client: Client, parameters: EstimateContractGasParameters) => {
	const data: EncodeFunctionDataReturnType = encodeFunctionData({
		abi: parameters.abi,
		functionName: parameters.functionName,
		args: parameters.args,
	})

	return getAction(
		client,
		estimateGas,
		'estimateGas',
	)({
		data: data,
		account: client.account,
		to: parameters.address,
		value: parameters.value,
	})
}
