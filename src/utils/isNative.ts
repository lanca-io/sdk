import { Address, zeroAddress } from 'viem'

export const isNative = (address: Address): boolean => address === zeroAddress
