export const swapDataAbi = {
	components: [
		{
			internalType: 'address',
			name: 'dexRouter',
			type: 'address',
		},
		{
			internalType: 'address',
			name: 'fromToken',
			type: 'address',
		},
		{
			internalType: 'uint256',
			name: 'fromAmount',
			type: 'uint256',
		},
		{
			internalType: 'address',
			name: 'toToken',
			type: 'address',
		},
		{
			internalType: 'uint256',
			name: 'toAmount',
			type: 'uint256',
		},
		{
			internalType: 'uint256',
			name: 'toAmountMin',
			type: 'uint256',
		},
		{
			internalType: 'bytes',
			name: 'dexCallData',
			type: 'bytes',
		},
	],
	internalType: 'struct ILancaDexSwap.SwapData[]',
	name: 'swapData',
	type: 'tuple[]',
}
