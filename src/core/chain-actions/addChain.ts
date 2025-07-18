import type { Client } from 'viem'
import type { Chain } from 'viem'
import { addChain } from 'viem/actions'
import { getAction } from 'viem/utils'

export const addEVMChain = async (client: Client, chain: Chain) => {
	return getAction(client, addChain, 'addChain')({ chain })
}
