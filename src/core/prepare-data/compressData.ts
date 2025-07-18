import type { Hex } from 'viem'
import type { IInputSwapData } from '../../types'
import { encodeAbiParameters } from 'viem'
import { swapDataAbi as abi } from '../../abi'
import { LibZip } from 'solady'

export const compressData = (data: IInputSwapData[]): Hex => {
	const encodedData = encodeAbiParameters([abi], [data])
	const compressedData: Hex = LibZip.cdCompress(encodedData) as Hex
	return compressedData
}
