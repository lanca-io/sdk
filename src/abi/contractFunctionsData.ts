export const functionsAbi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "ccipMessageId",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "requestId",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "requestType",
				type: "uint8",
			},
		],
		name: "FunctionsRequestError",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
		],
		name: "RequestFulfilled",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
		],
		name: "RequestSent",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "ccipMessageId",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "recipient",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "enum IStorage.CCIPToken",
				name: "token",
				type: "uint8",
			},
		],
		name: "TXConfirmed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "ccipMessageId",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "recipient",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "TXReleased",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "ccipMessageId",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "address",
				name: "sender",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "enum IStorage.CCIPToken",
				name: "token",
				type: "uint8",
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "srcChainSelector",
				type: "uint64",
			},
		],
		name: "UnconfirmedTXAdded",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "ccipMessageId",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "address",
				name: "sender",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "enum IStorage.CCIPToken",
				name: "token",
				type: "uint8",
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "dstChainSelector",
				type: "uint64",
			},
		],
		name: "UnconfirmedTXSent",
		type: "event",
	},
];
