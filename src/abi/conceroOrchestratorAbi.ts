import { Abi } from 'viem'

export const conceroAbiV1_5: Abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_functionsRouter',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_dexSwap',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_conceroBridge',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_pool',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_proxy',
				type: 'address',
			},
			{
				internalType: 'uint8',
				name: '_chainIndex',
				type: 'uint8',
			},
			{
				internalType: 'address[3]',
				name: '_messengers',
				type: 'address[3]',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'target',
				type: 'address',
			},
		],
		name: 'AddressEmptyCode',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'AddressInsufficientBalance',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ChainIndexOutOfBounds',
		type: 'error',
	},
	{
		inputs: [],
		name: 'FailedInnerCall',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidAddress',
		type: 'error',
	},
	{
		inputs: [],
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
		name: 'InvalidIntegratorFeeBps',
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
		name: 'NativeTokenIsNotERC20',
		type: 'error',
	},
	{
		inputs: [],
		name: 'NotMessenger',
		type: 'error',
	},
	{
		inputs: [],
		name: 'NotOwner',
		type: 'error',
	},
	{
		inputs: [],
		name: 'OnlyCLFRouter',
		type: 'error',
	},
	{
		inputs: [],
		name: 'OnlyPool',
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
		name: 'TokenTypeOutOfBounds',
		type: 'error',
	},
	{
		inputs: [],
		name: 'TransferFailed',
		type: 'error',
	},
	{
		inputs: [],
		name: 'TransferToNullAddress',
		type: 'error',
	},
	{
		inputs: [],
		name: 'TxAlreadyConfirmed',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'UnableToCompleteDelegateCall',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
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
				indexed: true,
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
		inputs: [
			{
				internalType: 'bytes32',
				name: 'conceroMessageId',
				type: 'bytes32',
			},
			{
				internalType: 'uint64',
				name: 'srcChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'bytes32',
				name: 'txDataHash',
				type: 'bytes32',
			},
		],
		name: 'addUnconfirmedTX',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'uint64',
						name: 'dstChainSelector',
						type: 'uint64',
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
				],
				internalType: 'struct IInfraStorage.IBridgeData',
				name: 'bridgeData',
				type: 'tuple',
			},
			{
				internalType: 'bytes',
				name: 'compressedDstSwapData',
				type: 'bytes',
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
				internalType: 'struct IInfraOrchestrator.IIntegration',
				name: 'integration',
				type: 'tuple',
			},
		],
		name: 'bridge',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '',
				type: 'uint64',
			},
		],
		name: 'clfPremiumFees',
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
				internalType: 'bytes32',
				name: '_conceroMessageId',
				type: 'bytes32',
			},
		],
		name: 'confirmTx',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'enum IInfraStorage.CCIPToken',
				name: 'tokenType',
				type: 'uint8',
			},
			{
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getSrcTotalFeeInUSDC',
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
				internalType: 'enum IInfraStorage.CCIPToken',
				name: 'tokenType',
				type: 'uint8',
			},
			{
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getSrcTotalFeeInUSDCViaDelegateCall',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'requestId',
				type: 'bytes32',
			},
			{
				internalType: 'bytes',
				name: 'response',
				type: 'bytes',
			},
			{
				internalType: 'bytes',
				name: 'err',
				type: 'bytes',
			},
		],
		name: 'handleOracleFulfillment',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_conceroMessageId',
				type: 'bytes32',
			},
		],
		name: 'isTxConfirmed',
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
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		name: 's_conceroContracts',
		outputs: [
			{
				internalType: 'address',
				name: 'conceroContract',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_donHostedSecretsSlotId',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_donHostedSecretsVersion',
		outputs: [
			{
				internalType: 'uint64',
				name: '',
				type: 'uint64',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_dstJsHashSum',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_ethersHashSum',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		name: 's_lastGasPrices',
		outputs: [
			{
				internalType: 'uint256',
				name: 'lastGasPrice',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_latestLinkNativeRate',
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
		name: 's_latestLinkUsdcRate',
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
		name: 's_latestNativeUsdcRate',
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
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 's_pendingSettlementIdsByDstChain',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'bridgeTxIds',
				type: 'bytes32',
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
		name: 's_pendingSettlementTxAmountByDstChain',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'bridgeTxId',
				type: 'bytes32',
			},
		],
		name: 's_pendingSettlementTxsById',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'recipient',
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
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		name: 's_poolReceiver',
		outputs: [
			{
				internalType: 'address',
				name: 'pool',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'clfRequestId',
				type: 'bytes32',
			},
		],
		name: 's_requests',
		outputs: [
			{
				internalType: 'enum IInfraStorage.RequestType',
				name: 'requestType',
				type: 'uint8',
			},
			{
				internalType: 'bool',
				name: 'isPending',
				type: 'bool',
			},
			{
				internalType: 'bytes32',
				name: 'conceroMessageId',
				type: 'bytes32',
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
		name: 's_routerAllowed',
		outputs: [
			{
				internalType: 'bool',
				name: 'isAllowed',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_srcJsHashSum',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'conceroMessageId',
				type: 'bytes32',
			},
		],
		name: 's_transactions',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'txDataHash',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'sender_DEPRECATED',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'recipient_DEPRECATED',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount_DEPRECATED',
				type: 'uint256',
			},
			{
				internalType: 'enum IInfraStorage.CCIPToken',
				name: 'token_DEPRECATED',
				type: 'uint8',
			},
			{
				internalType: 'uint64',
				name: 'srcChainSelector_DEPRECATED',
				type: 'uint64',
			},
			{
				internalType: 'bool',
				name: 'isConfirmed',
				type: 'bool',
			},
			{
				internalType: 'bytes',
				name: 'dstSwapData_DEPRECATED',
				type: 'bytes',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '_chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint256',
				name: 'feeAmount',
				type: 'uint256',
			},
		],
		name: 'setClfPremiumFees',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '_chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'address',
				name: '_conceroContract',
				type: 'address',
			},
		],
		name: 'setConceroContract',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_router',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: '_isApproved',
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
				internalType: 'uint8',
				name: '_donHostedSecretsSlotId',
				type: 'uint8',
			},
		],
		name: 'setDonHostedSecretsSlotID',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '_version',
				type: 'uint64',
			},
		],
		name: 'setDonHostedSecretsVersion',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '_chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'address',
				name: '_pool',
				type: 'address',
			},
		],
		name: 'setDstConceroPool',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_hashSum',
				type: 'bytes32',
			},
		],
		name: 'setDstJsHashSum',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_hashSum',
				type: 'bytes32',
			},
		],
		name: 'setEthersHashSum',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_hashSum',
				type: 'bytes32',
			},
		],
		name: 'setSrcJsHashSum',
		outputs: [],
		stateMutability: 'nonpayable',
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
				internalType: 'struct IDexSwap.SwapData[]',
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
				internalType: 'struct IInfraOrchestrator.IIntegration',
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
						internalType: 'uint64',
						name: 'dstChainSelector',
						type: 'uint64',
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
				],
				internalType: 'struct IInfraStorage.IBridgeData',
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
						name: 'dexData',
						type: 'bytes',
					},
				],
				internalType: 'struct IDexSwap.SwapData[]',
				name: 'srcSwapData',
				type: 'tuple[]',
			},
			{
				internalType: 'bytes',
				name: 'compressedDstSwapData',
				type: 'bytes',
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
				internalType: 'struct IInfraOrchestrator.IIntegration',
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
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'address[]',
				name: 'tokens',
				type: 'address[]',
			},
		],
		name: 'withdrawConceroFees',
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
		stateMutability: 'payable',
		type: 'receive',
	},
]

export const conceroAbiV1_6: Abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_functionsRouter',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_dexSwap',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_conceroBridge',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_pool',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_proxy',
				type: 'address',
			},
			{
				internalType: 'uint8',
				name: '_chainIndex',
				type: 'uint8',
			},
			{
				internalType: 'address[3]',
				name: '_messengers',
				type: 'address[3]',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'target',
				type: 'address',
			},
		],
		name: 'AddressEmptyCode',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'AddressInsufficientBalance',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ChainIndexOutOfBounds',
		type: 'error',
	},
	{
		inputs: [],
		name: 'FailedInnerCall',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidAddress',
		type: 'error',
	},
	{
		inputs: [],
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
		name: 'InvalidIntegratorFeeBps',
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
		name: 'NativeTokenIsNotERC20',
		type: 'error',
	},
	{
		inputs: [],
		name: 'NotMessenger',
		type: 'error',
	},
	{
		inputs: [],
		name: 'NotOwner',
		type: 'error',
	},
	{
		inputs: [],
		name: 'OnlyCLFRouter',
		type: 'error',
	},
	{
		inputs: [],
		name: 'OnlyPool',
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
		name: 'TokenTypeOutOfBounds',
		type: 'error',
	},
	{
		inputs: [],
		name: 'TransferFailed',
		type: 'error',
	},
	{
		inputs: [],
		name: 'TransferToNullAddress',
		type: 'error',
	},
	{
		inputs: [],
		name: 'TxAlreadyConfirmed',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'UnableToCompleteDelegateCall',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
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
				indexed: true,
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
		inputs: [
			{
				internalType: 'bytes32',
				name: 'conceroMessageId',
				type: 'bytes32',
			},
			{
				internalType: 'uint64',
				name: 'srcChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'bytes32',
				name: 'txDataHash',
				type: 'bytes32',
			},
		],
		name: 'addUnconfirmedTX',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'uint64',
						name: 'dstChainSelector',
						type: 'uint64',
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
				],
				internalType: 'struct IInfraStorage.IBridgeData',
				name: 'bridgeData',
				type: 'tuple',
			},
			{
				internalType: 'bytes',
				name: 'compressedDstSwapData',
				type: 'bytes',
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
				internalType: 'struct IInfraOrchestrator.IIntegration',
				name: 'integration',
				type: 'tuple',
			},
		],
		name: 'bridge',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '',
				type: 'uint64',
			},
		],
		name: 'clfPremiumFees',
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
				internalType: 'bytes32',
				name: '_conceroMessageId',
				type: 'bytes32',
			},
		],
		name: 'confirmTx',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'enum IInfraStorage.CCIPToken',
				name: 'tokenType',
				type: 'uint8',
			},
			{
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getSrcTotalFeeInUSDC',
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
				internalType: 'enum IInfraStorage.CCIPToken',
				name: 'tokenType',
				type: 'uint8',
			},
			{
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getSrcTotalFeeInUSDCViaDelegateCall',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'requestId',
				type: 'bytes32',
			},
			{
				internalType: 'bytes',
				name: 'response',
				type: 'bytes',
			},
			{
				internalType: 'bytes',
				name: 'err',
				type: 'bytes',
			},
		],
		name: 'handleOracleFulfillment',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_conceroMessageId',
				type: 'bytes32',
			},
		],
		name: 'isTxConfirmed',
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
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		name: 's_conceroContracts',
		outputs: [
			{
				internalType: 'address',
				name: 'conceroContract',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_donHostedSecretsSlotId',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_donHostedSecretsVersion',
		outputs: [
			{
				internalType: 'uint64',
				name: '',
				type: 'uint64',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_dstJsHashSum',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_ethersHashSum',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		name: 's_lastGasPrices',
		outputs: [
			{
				internalType: 'uint256',
				name: 'lastGasPrice',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_latestLinkNativeRate',
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
		name: 's_latestLinkUsdcRate',
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
		name: 's_latestNativeUsdcRate',
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
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 's_pendingSettlementIdsByDstChain',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'bridgeTxIds',
				type: 'bytes32',
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
		name: 's_pendingSettlementTxAmountByDstChain',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'bridgeTxId',
				type: 'bytes32',
			},
		],
		name: 's_pendingSettlementTxsById',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'recipient',
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
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		name: 's_poolReceiver',
		outputs: [
			{
				internalType: 'address',
				name: 'pool',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'clfRequestId',
				type: 'bytes32',
			},
		],
		name: 's_requests',
		outputs: [
			{
				internalType: 'enum IInfraStorage.RequestType',
				name: 'requestType',
				type: 'uint8',
			},
			{
				internalType: 'bool',
				name: 'isPending',
				type: 'bool',
			},
			{
				internalType: 'bytes32',
				name: 'conceroMessageId',
				type: 'bytes32',
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
		name: 's_routerAllowed',
		outputs: [
			{
				internalType: 'bool',
				name: 'isAllowed',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 's_srcJsHashSum',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'conceroMessageId',
				type: 'bytes32',
			},
		],
		name: 's_transactions',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'txDataHash',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'sender_DEPRECATED',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'recipient_DEPRECATED',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount_DEPRECATED',
				type: 'uint256',
			},
			{
				internalType: 'enum IInfraStorage.CCIPToken',
				name: 'token_DEPRECATED',
				type: 'uint8',
			},
			{
				internalType: 'uint64',
				name: 'srcChainSelector_DEPRECATED',
				type: 'uint64',
			},
			{
				internalType: 'bool',
				name: 'isConfirmed',
				type: 'bool',
			},
			{
				internalType: 'bytes',
				name: 'dstSwapData_DEPRECATED',
				type: 'bytes',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '_chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint256',
				name: 'feeAmount',
				type: 'uint256',
			},
		],
		name: 'setClfPremiumFees',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '_chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'address',
				name: '_conceroContract',
				type: 'address',
			},
		],
		name: 'setConceroContract',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_router',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: '_isApproved',
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
				internalType: 'uint8',
				name: '_donHostedSecretsSlotId',
				type: 'uint8',
			},
		],
		name: 'setDonHostedSecretsSlotID',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '_version',
				type: 'uint64',
			},
		],
		name: 'setDonHostedSecretsVersion',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: '_chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'address',
				name: '_pool',
				type: 'address',
			},
		],
		name: 'setDstConceroPool',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_hashSum',
				type: 'bytes32',
			},
		],
		name: 'setDstJsHashSum',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_hashSum',
				type: 'bytes32',
			},
		],
		name: 'setEthersHashSum',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '_hashSum',
				type: 'bytes32',
			},
		],
		name: 'setSrcJsHashSum',
		outputs: [],
		stateMutability: 'nonpayable',
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
				internalType: 'struct IDexSwap.SwapData[]',
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
				internalType: 'struct IInfraOrchestrator.IIntegration',
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
						internalType: 'enum IDexSwap.DexType',
						name: 'dexType',
						type: 'uint8',
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
						name: 'dexData',
						type: 'bytes',
					},
				],
				internalType: 'struct IDexSwap.SwapData_DEPRECATED[]',
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
				internalType: 'struct IInfraOrchestrator.IIntegration',
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
						internalType: 'uint64',
						name: 'dstChainSelector',
						type: 'uint64',
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
				],
				internalType: 'struct IInfraStorage.IBridgeData',
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
				internalType: 'struct IDexSwap.SwapData[]',
				name: 'srcSwapData',
				type: 'tuple[]',
			},
			{
				internalType: 'bytes',
				name: 'compressedDstSwapData',
				type: 'bytes',
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
				internalType: 'struct IInfraOrchestrator.IIntegration',
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
				components: [
					{
						internalType: 'uint64',
						name: 'dstChainSelector',
						type: 'uint64',
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
				],
				internalType: 'struct IInfraStorage.IBridgeData',
				name: 'bridgeData',
				type: 'tuple',
			},
			{
				components: [
					{
						internalType: 'enum IDexSwap.DexType',
						name: 'dexType',
						type: 'uint8',
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
						name: 'dexData',
						type: 'bytes',
					},
				],
				internalType: 'struct IDexSwap.SwapData_DEPRECATED[]',
				name: 'srcSwapData',
				type: 'tuple[]',
			},
			{
				internalType: 'bytes',
				name: 'compressedDstSwapData',
				type: 'bytes',
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
				internalType: 'struct IInfraOrchestrator.IIntegration',
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
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'address[]',
				name: 'tokens',
				type: 'address[]',
			},
		],
		name: 'withdrawConceroFees',
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
		stateMutability: 'payable',
		type: 'receive',
	},
]

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

export const conceroAbiV2 = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'conceroRouter',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'ccipRouter',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'lancaToken',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'lancaPool',
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
		inputs: [],
		name: 'BridgeAlreadyProcessed',
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
		inputs: [],
		name: 'InsufficientBridgeAmount',
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
		name: 'InvalidBridgeToken',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidCcipToken',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidCcipTxType',
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
		name: 'InvalidConceroMessageSender',
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
		name: 'InvalidDstChainGasLimit',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidDstChainSelector',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidFeeAmount',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidFeeToken',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidLancaBridgeMessageVersion',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidReceiver',
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
		name: 'InvalidRouter',
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
				internalType: 'enum LibErrors.UnauthorizedType',
				name: 'errorType',
				type: 'uint8',
			},
		],
		name: 'Unauthorized',
		type: 'error',
	},
	{
		inputs: [],
		name: 'UnauthorizedCcipMessageSender',
		type: 'error',
	},
	{
		inputs: [],
		name: 'UnauthorizedConceroMessageSender',
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
				name: 'id',
				type: 'bytes32',
			},
		],
		name: 'FailedExecutionLayerTxSettled',
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
				internalType: 'address',
				name: 'tokenAddress',
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
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'ccipMessageId',
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
				internalType: 'uint64',
				name: 'dstChainSelector',
				type: 'uint64',
			},
		],
		name: 'LancaSettlementSent',
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
				internalType: 'struct ILancaBridge.BridgeData',
				name: 'bridgeReq',
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
				internalType: 'struct ILancaBridge.Integration',
				name: '',
				type: 'tuple',
			},
		],
		name: 'bridge',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'bytes32',
						name: 'messageId',
						type: 'bytes32',
					},
					{
						internalType: 'uint64',
						name: 'sourceChainSelector',
						type: 'uint64',
					},
					{
						internalType: 'bytes',
						name: 'sender',
						type: 'bytes',
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes',
					},
					{
						components: [
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
						],
						internalType: 'struct Client.EVMTokenAmount[]',
						name: 'destTokenAmounts',
						type: 'tuple[]',
					},
				],
				internalType: 'struct Client.Any2EVMMessage',
				name: 'message',
				type: 'tuple',
			},
		],
		name: 'ccipReceive',
		outputs: [],
		stateMutability: 'nonpayable',
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
		inputs: [
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
				internalType: 'uint32',
				name: 'dstChainGasLimit',
				type: 'uint32',
			},
		],
		name: 'getBridgeFeeBreakdown',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
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
				internalType: 'uint64',
				name: 'ccipChainSelector',
				type: 'uint64',
			},
		],
		name: 'getConceroChainSelectorByCcipChainSelector',
		outputs: [
			{
				internalType: 'uint24',
				name: '',
				type: 'uint24',
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
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'feeToken',
				type: 'address',
			},
			{
				internalType: 'uint32',
				name: 'gasLimit',
				type: 'uint32',
			},
		],
		name: 'getFee',
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
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		name: 'getLancaBridgeContractByChain',
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
		inputs: [],
		name: 'getRouter',
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
				name: 'ccipChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint24',
				name: 'conceroChainSelector',
				type: 'uint24',
			},
		],
		name: 'setChainSelectors',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'address',
				name: 'lancaBridgeContract',
				type: 'address',
			},
		],
		name: 'setLancaBridgeContract',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes4',
				name: 'interfaceId',
				type: 'bytes4',
			},
		],
		name: 'supportsInterface',
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
] as Abi
