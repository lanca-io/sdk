import type { Address } from "viem";
import { ZeroAddress, AltZeroAddress } from "../constants/addresses";

export const isZeroAddress = (address: Address): boolean => {
    if (address === ZeroAddress || address === AltZeroAddress) return true
    return false
}

export const isNativeAddress = (address: Address): boolean => {
    if (address === ZeroAddress || address === AltZeroAddress) return true
    return false
}