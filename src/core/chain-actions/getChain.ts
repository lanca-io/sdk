import type { Client } from 'viem'
import { getAction } from 'viem/utils'
import { getChainId } from 'viem/actions'

export const getEVMChain = async (client: Client) => {
	if (!client || !client.chain || !client.chain.id) return
	return getAction(
		client,
		getChainId,
		'getChainId',
	)({
		client: client,
	})
}
