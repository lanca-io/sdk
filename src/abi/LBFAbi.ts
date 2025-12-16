import type { Abi } from 'viem'

export const LBFABI: Abi = [
    {
      inputs: [],
      name: 'AddressShouldNotBeZero',
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
      inputs: [
        {
          internalType: 'uint24',
          name: 'dstChainSelector',
          type: 'uint24',
        },
      ],
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
      name: 'InvalidLiqTokenDecimals',
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
          name: 'currentRelayer',
          type: 'address',
        },
      ],
      name: 'RelayerAlreadySet',
      type: 'error',
    },
    {
      inputs: [],
      name: 'RelayerIsNotSet',
      type: 'error',
    },
    {
      inputs: [],
      name: 'RequiredValidatorsCountUnset',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: 'bits',
          type: 'uint8',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'SafeCastOverflowedUintDowncast',
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
          name: 'dstRelayerLib',
          type: 'address',
        },
      ],
      name: 'UnauthorizedRelayerLib',
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
      inputs: [
        {
          internalType: 'address',
          name: 'currentValidator',
          type: 'address',
        },
      ],
      name: 'ValidatorAlreadySet',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ValidatorIsNotSet',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ValidatorsConsensusNotReached',
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
          internalType: 'bytes',
          name: 'dstChainData',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'tokenSender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenAmountBeforeFee',
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
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
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
      inputs: [],
      name: 'ADMIN',
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
      name: 'DEFAULT_ADMIN_ROLE',
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
      name: 'LANCA_KEEPER',
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
          internalType: 'bytes',
          name: 'dstChainData',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'payload',
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
          internalType: 'bytes',
          name: 'messageReceipt',
          type: 'bytes',
        },
        {
          internalType: 'bool[]',
          name: 'validationChecks',
          type: 'bool[]',
        },
        {
          internalType: 'address[]',
          name: 'validatorLibs',
          type: 'address[]',
        },
        {
          internalType: 'address',
          name: 'relayerLib',
          type: 'address',
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
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint24',
          name: 'dstChainSelector',
          type: 'uint24',
        },
        {
          internalType: 'bytes',
          name: 'dstChainData',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'payload',
          type: 'bytes',
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
      name: 'getLancaBridgeFeeBps',
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
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getLiquidityToken',
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
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getLpFeeBps',
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
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getRebalancerFeeBps',
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
      name: 'getRelayerLib',
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
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
      ],
      name: 'getRoleAdmin',
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
      name: 'getValidatorLib',
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
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'hasRole',
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
          internalType: 'address',
          name: 'admin',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'lancaKeeper',
          type: 'address',
        },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'removeRelayerLib',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'removeValidatorLib',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
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
          internalType: 'bytes32',
          name: 'dstPool',
          type: 'bytes32',
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
          internalType: 'uint8',
          name: 'lancaBridgeFeeBps',
          type: 'uint8',
        },
      ],
      name: 'setLancaBridgeFeeBps',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: 'lpFeeBps',
          type: 'uint8',
        },
      ],
      name: 'setLpFeeBps',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: 'rebalancerFeeBps',
          type: 'uint8',
        },
      ],
      name: 'setRebalancerFeeBps',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'relayerLib',
          type: 'address',
        },
      ],
      name: 'setRelayerLib',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'validatorLib',
          type: 'address',
        },
      ],
      name: 'setValidatorLib',
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
    {
      stateMutability: 'payable',
      type: 'receive',
    },
  ];
