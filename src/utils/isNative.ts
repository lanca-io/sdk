import type { Address } from 'viem'
import { zeroAddress } from 'viem'

export const isNative = (address: Address): boolean => address === zeroAddress
