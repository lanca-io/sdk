export const conceroAbi = [
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
				internalType: 'struct IInfraStorage.BridgeData',
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
				internalType: 'struct IInfraOrchestrator.Integration',
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
				internalType: 'struct IInfraOrchestrator.Integration',
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
				internalType: 'struct IInfraStorage.BridgeData',
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
				internalType: 'struct IInfraOrchestrator.Integration',
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
