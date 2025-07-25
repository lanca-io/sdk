import type { Address } from "viem"
import type { Client } from "viem"
import { readContract } from "viem/actions"
import { conceroAbiV2 as v2ABI } from "../../abi"
import { zeroAddress } from "viem"
import { isNative } from "../../utils"


export const computeTxValue = async (client: Client, contractAddress: Address, chainSelector: bigint, amount: bigint) => {


}


export const computeV2Value = async (
    client: Client,
    contractAddress: Address,
    chainSelector: bigint,
    amount: bigint
): Promise<bigint> => {
    try {
        return await readContract(client, {
            address: contractAddress,
            abi: v2ABI,
            functionName: 'getFee',
            args: [chainSelector, amount, zeroAddress, 1000000],
        }) as bigint
    } catch (_) {
        return 0n
    }





