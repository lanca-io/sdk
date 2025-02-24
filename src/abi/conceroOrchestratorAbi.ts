import { Abi } from 'viem'

export const conceroAbiV1_7: Abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'usdc',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'lancaBridge',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'dexSwap',
				type: 'address',
			},
			{
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [
			{
				internalType: 'enum LibErrors.InvalidAddressType',
				name: 'errorType',
				type: 'uint8',
			},
		],
		name: 'InvalidAddress',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidAmount',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidBridgeData',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidBridgeToken',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidChainSelector',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidIntegratorFeeBps',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
		],
		name: 'InvalidLancaBridge',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidLancaBridgeContract',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidLancaBridgeSender',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidLancaBridgeSrcChain',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidRecipient',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidSwapData',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ReentrancyGuardReentrantCall',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
		],
		name: 'SafeERC20FailedOperation',
		type: 'error',
	},
	{
		inputs: [],
		name: 'TransferFailed',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'enum LibErrors.UnauthorizedType',
				name: 'errorType',
				type: 'uint8',
			},
		],
		name: 'Unauthorized',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'DstSwapFailed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'integrator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'IntegratorFeesCollected',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'integrator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'IntegratorFeesWithdrawn',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'id',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'receiver',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'LancaBridgeReceived',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'conceroMessageId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'receiver',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
		],
		name: 'LancaBridgeSent',
		type: 'event',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'token',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'receiver',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
					{
						internalType: 'uint64',
						name: 'dstChainSelector',
						type: 'uint64',
					},
					{
						internalType: 'bytes',
						name: 'compressedDstSwapData',
						type: 'bytes',
					},
				],
				internalType: 'struct LancaOrchestrator.BridgeData',
				name: 'bridgeData',
				type: 'tuple',
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'integrator',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'feeBps',
						type: 'uint256',
					},
				],
				internalType: 'struct ILancaIntegration.Integration',
				name: 'integration',
				type: 'tuple',
			},
		],
		name: 'bridge',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'integrator',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
		],
		name: 'getIntegratorFeeAmount',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLancaBridge',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
		],
		name: 'getLancaOrchestratorByChain',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getOwner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'router',
				type: 'address',
			},
		],
		name: 'isDexRouterAllowed',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'bytes32',
						name: 'id',
						type: 'bytes32',
					},
					{
						internalType: 'address',
						name: 'sender',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'token',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
					{
						internalType: 'uint64',
						name: 'srcChainSelector',
						type: 'uint64',
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes',
					},
				],
				internalType: 'struct ILancaBridgeClient.LancaBridgeMessage',
				name: 'message',
				type: 'tuple',
			},
		],
		name: 'lancaBridgeReceive',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'router',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: 'isApproved',
				type: 'bool',
			},
		],
		name: 'setDexRouterAddress',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'address',
				name: 'dstOrchestrator',
				type: 'address',
			},
		],
		name: 'setDstLancaOrchestratorByChain',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
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
			},
			{
				internalType: 'address',
				name: 'receiver',
				type: 'address',
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'integrator',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'feeBps',
						type: 'uint256',
					},
				],
				internalType: 'struct ILancaIntegration.Integration',
				name: 'integration',
				type: 'tuple',
			},
		],
		name: 'swap',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'token',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'receiver',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
					{
						internalType: 'uint64',
						name: 'dstChainSelector',
						type: 'uint64',
					},
					{
						internalType: 'bytes',
						name: 'compressedDstSwapData',
						type: 'bytes',
					},
				],
				internalType: 'struct LancaOrchestrator.BridgeData',
				name: 'bridgeData',
				type: 'tuple',
			},
			{
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
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'integrator',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'feeBps',
						type: 'uint256',
					},
				],
				internalType: 'struct ILancaIntegration.Integration',
				name: 'integration',
				type: 'tuple',
			},
		],
		name: 'swapAndBridge',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: 'tokens',
				type: 'address[]',
			},
		],
		name: 'withdrawIntegratorFees',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: 'tokens',
				type: 'address[]',
			},
		],
		name: 'withdrawLancaFee',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
