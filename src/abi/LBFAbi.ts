import type { Abi } from 'viem'

export const LBFABI: Abi = [
	{
		inputs: [],
		name: 'AddressShouldNotBeZero',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: 'response',
				type: 'bytes',
			},
		],
		name: 'DelegateCallFailed',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'provided',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'required',
				type: 'uint256',
			},
		],
		name: 'InsufficientFee',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidAmount',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidChainSelector',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'enum IConceroClientErrors.MessageConfigErrorType',
				name: 'error',
				type: 'uint8',
			},
		],
		name: 'InvalidClientMessageConfig',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidConceroMessage',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidConceroMessageType',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'router',
				type: 'address',
			},
		],
		name: 'InvalidConceroRouter',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidDstChainData',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidDstChainSelector',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidDstGasLimitOrCallData',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidFeeAmount',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidToken',
		type: 'error',
	},
	{
		inputs: [],
		name: 'MessageTooLarge',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'target',
				type: 'address',
			},
		],
		name: 'NotAContract',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'chainSelector',
				type: 'uint24',
			},
		],
		name: 'PoolAlreadyExists',
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
				internalType: 'enum IConceroClientErrors.RequiredVariableUnsetType',
				name: 'variableType',
				type: 'uint8',
			},
		],
		name: 'RequiredVariableUnset',
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
		inputs: [
			{
				internalType: 'address',
				name: 'caller',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'expected',
				type: 'address',
			},
		],
		name: 'UnauthorizedCaller',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'caller',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'expected',
				type: 'address',
			},
		],
		name: 'UnauthorizedSender',
		type: 'error',
	},
	{
		inputs: [],
		name: 'UnsupportedFeeTokenType',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'messageId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'tokenAmountAfterFee',
				type: 'uint256',
			},
		],
		name: 'BridgeDelivered',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'messageId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'tokenSender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'tokenReceiver',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'tokenAmountBeforeFee',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'dstGasLimit',
				type: 'uint256',
			},
		],
		name: 'BridgeSent',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint24',
				name: 'sourceChainSelector',
				type: 'uint24',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'oldAmount',
				type: 'uint256',
			},
		],
		name: 'SrcBridgeReorged',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'tokenReceiver',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'tokenAmount',
				type: 'uint256',
			},
			{
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
			{
				internalType: 'uint256',
				name: 'dstGasLimit',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: 'dstCallData',
				type: 'bytes',
			},
		],
		name: 'bridge',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'messageId',
				type: 'bytes32',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'messageId',
				type: 'bytes32',
			},
			{
				internalType: 'uint24',
				name: 'srcChainSelector',
				type: 'uint24',
			},
			{
				internalType: 'bytes',
				name: 'sender',
				type: 'bytes',
			},
			{
				internalType: 'bytes',
				name: 'message',
				type: 'bytes',
			},
		],
		name: 'conceroReceive',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getActiveBalance',
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
		inputs: [
			{
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
			{
				internalType: 'uint256',
				name: 'dstGasLimit',
				type: 'uint256',
			},
		],
		name: 'getBridgeNativeFee',
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
		name: 'getDeficit',
		outputs: [
			{
				internalType: 'uint256',
				name: 'deficit',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'chainSelector',
				type: 'uint24',
			},
		],
		name: 'getDstPool',
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
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getLancaFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLancaKeeper',
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
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getLpFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getPoolData',
		outputs: [
			{
				internalType: 'uint256',
				name: 'deficit',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'surplus',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getRebalancerFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getSurplus',
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
		name: 'getTargetBalance',
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
		name: 'getTodayStartTimestamp',
		outputs: [
			{
				internalType: 'uint32',
				name: '',
				type: 'uint32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getYesterdayFlow',
		outputs: [
			{
				components: [
					{
						internalType: 'uint256',
						name: 'inflow',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'outflow',
						type: 'uint256',
					},
				],
				internalType: 'struct IBase.LiqTokenDailyFlow',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getYesterdayStartTimestamp',
		outputs: [
			{
				internalType: 'uint32',
				name: '',
				type: 'uint32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'chainSelector',
				type: 'uint24',
			},
			{
				internalType: 'address',
				name: 'dstPool',
				type: 'address',
			},
		],
		name: 'setDstPool',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'lancaKeeper',
				type: 'address',
			},
		],
		name: 'setLancaKeeper',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		stateMutability: 'payable',
		type: 'receive',
	},
]
