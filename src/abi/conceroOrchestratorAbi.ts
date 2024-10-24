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
				name: '_concero',
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
		name: 'ConceroCommon_ChainIndexOutOfBounds',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_messenger',
				type: 'address',
			},
		],
		name: 'ConceroCommon_NotMessenger',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ConceroCommon_TokenTypeOutOfBounds',
		type: 'error',
	},
	{
		inputs: [],
		name: 'FailedInnerCall',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'balance',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'InsufficientBalance',
		type: 'error',
	},
	{
		inputs: [],
		name: 'NativeTokenIsNotERC20',
		type: 'error',
	},
	{
		inputs: [],
		name: 'Orchestrator_InvalidAmount',
		type: 'error',
	},
	{
		inputs: [],
		name: 'Orchestrator_InvalidBridgeData',
		type: 'error',
	},
	{
		inputs: [],
		name: 'Orchestrator_InvalidBridgeToken',
		type: 'error',
	},
	{
		inputs: [],
		name: 'Orchestrator_InvalidSwapData',
		type: 'error',
	},
	{
		inputs: [],
		name: 'Orchestrator_OnlyRouterCanFulfill',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: 'delegateError',
				type: 'bytes',
			},
		],
		name: 'Orchestrator_UnableToCompleteDelegateCall',
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
		inputs: [
			{
				internalType: 'address',
				name: 'msgSender',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'StorageSetters_CallableOnlyByOwner',
		type: 'error',
	},
	{
		inputs: [],
		name: 'StorageSetters_InvalidAddress',
		type: 'error',
	},
	{
		inputs: [],
		name: 'TransferToNullAddress',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'previousValue',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'feeAmount',
				type: 'uint256',
			},
		],
		name: 'CLFPremiumFeeUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'conceroContract',
				type: 'address',
			},
		],
		name: 'ConceroContractUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'previousDstHashSum',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'newDstHashSum',
				type: 'bytes32',
			},
		],
		name: 'DestinationJsHashSumUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint64',
				name: 'previousDonSecretVersion',
				type: 'uint64',
			},
			{
				indexed: false,
				internalType: 'uint64',
				name: 'newDonSecretVersion',
				type: 'uint64',
			},
		],
		name: 'DonSecretVersionUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint8',
				name: 'previousDonSlot',
				type: 'uint8',
			},
			{
				indexed: false,
				internalType: 'uint8',
				name: 'newDonSlot',
				type: 'uint8',
			},
		],
		name: 'DonSlotIdUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'previousValue',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'hashSum',
				type: 'bytes32',
			},
		],
		name: 'EthersHashSumUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'requestId',
				type: 'bytes32',
			},
		],
		name: 'Orchestrator_RequestFulfilled',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [],
		name: 'Orchestrator_StartBridge',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [],
		name: 'Orchestrator_StartSwap',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [],
		name: 'Orchestrator_StartSwapAndBridge',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [],
		name: 'Orchestrator_SwapSuccess',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'previousSrcHashSum',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'newSrcHashSum',
				type: 'bytes32',
			},
		],
		name: 'SourceJsHashSumUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'router',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'isApproved',
				type: 'uint256',
			},
		],
		name: 'Storage_NewRouterAdded',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'ccipMessageId',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'recipient',
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
				internalType: 'enum IStorage.CCIPToken',
				name: 'token',
				type: 'uint8',
			},
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: 'dstSwapData',
				type: 'bytes',
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
						internalType: 'enum IStorage.CCIPToken',
						name: 'tokenType',
						type: 'uint8',
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
						internalType: 'address',
						name: 'receiver',
						type: 'address',
					},
				],
				internalType: 'struct IStorage.BridgeData',
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
				name: 'dstSwapData',
				type: 'tuple[]',
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
				internalType: 'enum IStorage.CCIPToken',
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
				internalType: 'enum IStorage.CCIPToken',
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
				name: '_ccipMessageId',
				type: 'bytes32',
			},
		],
		name: 'getTransaction',
		outputs: [
			{
				components: [
					{
						internalType: 'bytes32',
						name: 'ccipMessageId',
						type: 'bytes32',
					},
					{
						internalType: 'address',
						name: 'sender',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'recipient',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
					{
						internalType: 'enum IStorage.CCIPToken',
						name: 'token',
						type: 'uint8',
					},
					{
						internalType: 'uint64',
						name: 'srcChainSelector',
						type: 'uint64',
					},
					{
						internalType: 'bool',
						name: 'isConfirmed',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'dstSwapData',
						type: 'bytes',
					},
				],
				internalType: 'struct IStorage.Transaction',
				name: 'transaction',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
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
				name: '',
				type: 'bytes32',
			},
		],
		name: 's_requests',
		outputs: [
			{
				internalType: 'enum IStorage.RequestType',
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
				name: 'ccipMessageId',
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
				internalType: 'uint256',
				name: 'isAllowed',
				type: 'uint256',
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
				name: '',
				type: 'bytes32',
			},
		],
		name: 's_transactions',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'ccipMessageId',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'enum IStorage.CCIPToken',
				name: 'token',
				type: 'uint8',
			},
			{
				internalType: 'uint64',
				name: 'srcChainSelector',
				type: 'uint64',
			},
			{
				internalType: 'bool',
				name: 'isConfirmed',
				type: 'bool',
			},
			{
				internalType: 'bytes',
				name: 'dstSwapData',
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
				internalType: 'uint256',
				name: '_isApproved',
				type: 'uint256',
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
				name: '_swapData',
				type: 'tuple[]',
			},
			{
				internalType: 'address',
				name: '_receiver',
				type: 'address',
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
						internalType: 'enum IStorage.CCIPToken',
						name: 'tokenType',
						type: 'uint8',
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
						internalType: 'address',
						name: 'receiver',
						type: 'address',
					},
				],
				internalType: 'struct IStorage.BridgeData',
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
				name: 'dstSwapData',
				type: 'tuple[]',
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
		name: 'withdraw',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		stateMutability: 'payable',
		type: 'receive',
	},
]
