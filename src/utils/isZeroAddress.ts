import type { Address } from 'viem'
import { ZeroAddress, AltZeroAddress } from '../constants'

export const isZeroAddress = (address: Address): boolean => {
	if (address === ZeroAddress || address === AltZeroAddress) {
		return true
	}
	return false
}
