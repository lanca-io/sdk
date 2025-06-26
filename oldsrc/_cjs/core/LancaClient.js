Object.defineProperty(exports, '__esModule', { value: true })
exports.LancaClient = void 0
const solady_1 = require('solady')
const viem_1 = require('viem')
const abi_1 = require('../abi')
const configs_1 = require('../configs')
const configs_2 = require('../configs')
const constants_1 = require('../constants')
const errors_1 = require('../errors')
const http_1 = require('../http')
const types_1 = require('../types')
const utils_1 = require('../utils')
const op_stack_1 = require('viem/op-stack')
const constants_2 = require('../constants')
const errors_2 = require('../errors')
class LancaClient {
  config
  constructor({
    integratorAddress = viem_1.zeroAddress,
    feeBps = 0n,
    chains = configs_1.supportedViemChainsMap,
    testnet = false,
  } = {}) {
    this.config = { integratorAddress, feeBps, chains, testnet }
  }
  async getRoute({
    fromChainId,
    toChainId,
    fromToken,
    toToken,
    amount,
    fromAddress,
    toAddress,
    slippageTolerance = constants_1.DEFAULT_SLIPPAGE,
  }) {
    const options = new URLSearchParams({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      fromAddress,
      toAddress,
      slippageTolerance,
    })
    try {
      const routeResponse = await http_1.httpClient.get(
        configs_2.conceroApi.route,
        options
      )
      return routeResponse?.data
    } catch (error) {
      await errors_1.globalErrorHandler.handle(error)
      throw errors_1.globalErrorHandler.parse(error)
    }
  }
  async executeRoute(route, walletClient, executionConfig, destinationAddress) {
    try {
      const { chains } = this.config
      if (!walletClient) {
        throw new errors_1.WalletClientError('Wallet client not initialized')
      }
      this.validateRoute(route)
      const { switchChainHook, updateRouteStatusHook } = executionConfig
      const routeStatus = this.initRouteStepsStatuses(route)
      updateRouteStatusHook?.(routeStatus)
      await this.handleSwitchChain(
        walletClient,
        routeStatus,
        switchChainHook,
        updateRouteStatusHook
      )
      const [clientAddress] = await walletClient.getAddresses()
      const fromChainId = route.from.chain.id
      const inputRouteData = this.buildRouteData(
        route,
        clientAddress,
        destinationAddress
      )
      const conceroAddress = this.config.testnet
        ? configs_1.conceroV2AddressesMap[fromChainId]
        : configs_1.conceroAddressesMap[fromChainId]
      const publicClient = (0, viem_1.createPublicClient)({
        chain: chains[fromChainId].chain,
        transport: chains[fromChainId].provider,
      })
      if (!publicClient) {
        throw new errors_1.PublicClientError('Public client not initialized')
      }
      await this.handleAllowance(
        walletClient,
        publicClient,
        clientAddress,
        route.from,
        routeStatus,
        updateRouteStatusHook
      )
      const hash = await this.handleTransaction(
        publicClient,
        walletClient,
        conceroAddress,
        clientAddress,
        inputRouteData,
        routeStatus,
        destinationAddress,
        updateRouteStatusHook
      )
      await this.handleTransactionStatus(
        hash,
        publicClient,
        routeStatus,
        updateRouteStatusHook
      )
      return routeStatus
    } catch (error) {
      await errors_1.globalErrorHandler.handle(error)
      throw errors_1.globalErrorHandler.parse(error)
    }
  }
  async getSupportedChains() {
    try {
      const supportedChainsResponse = await http_1.httpClient.get(
        configs_2.conceroApi.chains
      )
      return supportedChainsResponse?.data
    } catch (error) {
      await errors_1.globalErrorHandler.handle(error)
      throw errors_1.globalErrorHandler.parse(error)
    }
  }
  async getSupportedTokens({
    chainId,
    name,
    symbol,
    limit = constants_1.DEFAULT_TOKENS_LIMIT,
  }) {
    const options = new URLSearchParams({
      chain_id: chainId,
      limit,
      ...(name && { name }),
      ...(symbol && { symbol }),
    })
    try {
      const supportedTokensResponse = await http_1.httpClient.get(
        configs_2.conceroApi.tokens,
        options
      )
      return supportedTokensResponse?.data
    } catch (error) {
      await errors_1.globalErrorHandler.handle(error)
      throw errors_1.globalErrorHandler.parse(error)
    }
  }
  async getRouteStatus(txHash) {
    const options = new URLSearchParams({
      txHash,
    })
    const routeStatusResponse = await http_1.httpClient.get(
      configs_2.conceroApi.routeStatus,
      options
    )
    return routeStatusResponse?.data
  }
  validateRoute(route) {
    if (!route) {
      throw new errors_1.NoRouteError('Route not initialized')
    }
    if (!route.from.amount || !route.to.amount) {
      throw new errors_1.WrongAmountError('0')
    }
    if (
      route.from.token.address === route.to.token.address &&
      route.from.chain?.id === route.to.chain?.id
    ) {
      throw new errors_1.TokensAreTheSameError([
        route.from.token.address,
        route.to.token.address,
      ])
    }
  }
  async handleSwitchChain(
    walletClient,
    routeStatus,
    switchChainHook,
    updateRouteStatusHook
  ) {
    try {
      const currentChainId = await walletClient.getChainId()
      const chainIdFrom = Number(routeStatus.from.chain.id)
      if (String(chainIdFrom) === String(currentChainId)) {
        updateRouteStatusHook?.(routeStatus)
        return
      }
      routeStatus.steps.unshift({
        type: types_1.StepType.SWITCH_CHAIN,
        execution: { status: types_1.Status.PENDING },
      })
      const { execution } = routeStatus.steps[0]
      updateRouteStatusHook?.(routeStatus)
      try {
        if (switchChainHook) {
          await switchChainHook(chainIdFrom)
        } else {
          try {
            await walletClient.switchChain({ id: chainIdFrom })
          } catch (switchError) {
            if (switchError instanceof viem_1.UserRejectedRequestError) {
              execution.status = types_1.Status.REJECTED
              execution.error = 'User rejected chain switch'
              updateRouteStatusHook?.(routeStatus)
              throw errors_1.globalErrorHandler.parse(switchError)
            }
            if (
              switchError instanceof viem_1.SwitchChainError &&
              this.config.chains &&
              this.config.chains[chainIdFrom]
            ) {
              try {
                await this.addChainToWallet(walletClient, chainIdFrom)
              } catch (addChainError) {
                execution.status = types_1.Status.FAILED
                execution.error = 'Failed to add chain'
                updateRouteStatusHook?.(routeStatus)
                throw addChainError
              }
            } else {
              execution.status = types_1.Status.FAILED
              execution.error = 'Chain switch failed'
              updateRouteStatusHook?.(routeStatus)
              throw switchError
            }
          }
        }
        execution.status = types_1.Status.SUCCESS
        updateRouteStatusHook?.(routeStatus)
      } catch (error) {
        if (
          execution.status !== types_1.Status.REJECTED &&
          execution.status !== types_1.Status.FAILED
        ) {
          execution.status = types_1.Status.FAILED
          execution.error = 'Failed to switch chain'
          updateRouteStatusHook?.(routeStatus)
        }
        throw error instanceof errors_2.LancaClientError
          ? error
          : errors_1.globalErrorHandler.parse(error)
      }
    } catch (error) {
      const parsedError =
        error instanceof errors_2.LancaClientError
          ? error
          : errors_1.globalErrorHandler.parse(error)
      await errors_1.globalErrorHandler.handle(parsedError)
      throw parsedError
    }
  }
  async addChainToWallet(walletClient, chainId) {
    try {
      const chainConfig = this.config.chains[chainId]
      const chainInfo = chainConfig.chain
      const chainToAdd = {
        id: chainId,
        name: chainInfo.name,
        nativeCurrency: chainInfo.nativeCurrency,
        rpcUrls: {
          default: {
            http: chainInfo.rpcUrls?.default?.http
              ? Array.isArray(chainInfo.rpcUrls.default.http)
                ? chainInfo.rpcUrls.default.http
                : [chainInfo.rpcUrls.default.http]
              : [],
          },
          public: {
            http: chainInfo.rpcUrls?.public?.http
              ? Array.isArray(chainInfo.rpcUrls.public.http)
                ? chainInfo.rpcUrls.public.http
                : [chainInfo.rpcUrls.public.http]
              : [],
          },
        },
      }
      try {
        await walletClient.addChain({
          chain: chainToAdd,
        })
        await (0, utils_1.sleep)(250)
        await walletClient.switchChain({
          id: chainId,
        })
        return
      } catch (addChainError) {
        if (addChainError instanceof viem_1.UserRejectedRequestError) {
          throw errors_1.globalErrorHandler.parse(addChainError)
        }
        try {
          await walletClient.switchChain({
            id: chainId,
          })
          return
        } catch (switchError) {
          if (switchError instanceof viem_1.UserRejectedRequestError) {
            throw errors_1.globalErrorHandler.parse(switchError)
          }
          throw errors_1.globalErrorHandler.parse(addChainError)
        }
      }
    } catch (error) {
      const parsedError =
        error instanceof errors_2.LancaClientError
          ? error
          : errors_1.globalErrorHandler.parse(error)
      await errors_1.globalErrorHandler.handle(parsedError)
      throw parsedError
    }
  }
  async verifyAllowance(
    publicClient,
    tokenAddress,
    clientAddress,
    conceroAddress,
    requiredAmount,
    retries = 5,
    delayMs = 3000
  ) {
    for (let attempt = 0; attempt < retries; attempt++) {
      const currentAllowance = await publicClient.readContract({
        abi: viem_1.erc20Abi,
        functionName: 'allowance',
        address: tokenAddress,
        args: [clientAddress, conceroAddress],
      })
      if (currentAllowance >= requiredAmount) {
        return true
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
    return false
  }
  async handleAllowance(
    walletClient,
    publicClient,
    clientAddress,
    txData,
    routeStatus,
    updateRouteStatusHook
  ) {
    const { token, amount, chain } = txData
    if ((0, utils_1.isNative)(token.address)) {
      return
    }
    const amountInDecimals = BigInt(amount)
    const isSwitchStepPresent =
      routeStatus.steps[0].type === types_1.StepType.SWITCH_CHAIN
    const allowanceIndex = isSwitchStepPresent ? 1 : 0
    routeStatus.steps.splice(allowanceIndex, 0, {
      type: types_1.StepType.ALLOWANCE,
      execution: {
        status: types_1.Status.NOT_STARTED,
      },
    })
    updateRouteStatusHook?.(routeStatus)
    const { execution } = routeStatus.steps[allowanceIndex]
    const conceroAddress = this.config.testnet
      ? configs_1.conceroV2AddressesMap[chain.id]
      : configs_1.conceroAddressesMap[chain.id]
    execution.status = types_1.Status.PENDING
    updateRouteStatusHook?.(routeStatus)
    const allowance = await publicClient.readContract({
      abi: viem_1.erc20Abi,
      functionName: 'allowance',
      address: token.address,
      args: [clientAddress, conceroAddress],
    })
    if (allowance >= amountInDecimals) {
      execution.status = types_1.Status.SUCCESS
      updateRouteStatusHook?.(routeStatus)
      return
    }
    const approvalAmount = this.config.testnet
      ? constants_1.UINT_MAX
      : amountInDecimals
    const contractArgs = {
      account: walletClient.account,
      address: token.address,
      abi: viem_1.erc20Abi,
      functionName: 'approve',
      args: [conceroAddress, approvalAmount],
      value: 0n,
    }
    try {
      const gasEstimate = await this.estimateGas(publicClient, contractArgs)
      const { request } = await publicClient.simulateContract({
        ...contractArgs,
        gas: gasEstimate,
        chain: publicClient.chain,
      })
      const approveTxHash = await walletClient.writeContract(request)
      if (approveTxHash) {
        const chainId = publicClient.chain?.id || 0
        await publicClient.waitForTransactionReceipt({
          hash: approveTxHash,
          timeout: 0,
          confirmations: (0, constants_2.getChainConfirmations)(chainId),
        })
        const allowanceVerified = await this.verifyAllowance(
          publicClient,
          token.address,
          clientAddress,
          conceroAddress,
          amountInDecimals
        )
        if (allowanceVerified) {
          execution.status = types_1.Status.SUCCESS
          execution.txHash = approveTxHash.toLowerCase()
        } else {
          execution.status = types_1.Status.FAILED
          execution.error = 'Allowance not updated after approval'
        }
        updateRouteStatusHook?.(routeStatus)
      } else {
        execution.status = types_1.Status.FAILED
        execution.error = 'Failed to approve allowance'
        updateRouteStatusHook?.(routeStatus)
      }
    } catch (error) {
      if (
        error instanceof viem_1.UserRejectedRequestError ||
        (error instanceof viem_1.ContractFunctionExecutionError &&
          error.message &&
          error.message.includes('rejected'))
      ) {
        execution.status = types_1.Status.REJECTED
        execution.error = 'User rejected the request'
        updateRouteStatusHook?.(routeStatus)
        throw errors_1.globalErrorHandler.parse(error)
      }
      execution.status = types_1.Status.FAILED
      execution.error = 'Failed to approve allowance'
      updateRouteStatusHook?.(routeStatus)
      throw errors_1.globalErrorHandler.parse(error)
    }
  }
  async handleTransaction(
    publicClient,
    walletClient,
    conceroAddress,
    clientAddress,
    txArgs,
    routeStatus,
    destinationAddress,
    updateRouteStatusHook
  ) {
    const swapStep = routeStatus.steps.find(
      ({ type }) =>
        type === types_1.StepType.SRC_SWAP || type === types_1.StepType.BRIDGE
    )
    swapStep.execution.status = types_1.Status.PENDING
    updateRouteStatusHook?.(routeStatus)
    const { txName, args, isFromNativeToken, fromAmount } =
      this.prepareTransactionArgs(
        txArgs,
        clientAddress,
        swapStep,
        destinationAddress
      )
    let txHash = viem_1.zeroHash
    let txValue
    if (this.config.testnet) {
      txValue = await this.computeV2TxValue(
        publicClient,
        conceroAddress,
        txArgs
      )
    } else {
      txValue = isFromNativeToken ? fromAmount : 0n
    }
    const abi = this.config.testnet ? abi_1.conceroAbiV2 : abi_1.conceroAbiV1_7
    const contractArgs = {
      account: walletClient.account,
      abi: abi,
      functionName: txName,
      address: conceroAddress,
      args,
      value: txValue,
    }
    try {
      const gasEstimate = await this.estimateGas(publicClient, contractArgs)
      const { request } = await publicClient.simulateContract({
        ...contractArgs,
        gas: gasEstimate,
        chain: publicClient.chain,
      })
      txHash = (await walletClient.writeContract(request)).toLowerCase()
      swapStep.execution.txHash = txHash
    } catch (error) {
      if (
        error instanceof viem_1.UserRejectedRequestError ||
        (error instanceof viem_1.ContractFunctionExecutionError &&
          error.message &&
          error.message.includes('rejected'))
      ) {
        swapStep.execution.status = types_1.Status.REJECTED
        swapStep.execution.error = 'User rejected the request'
        updateRouteStatusHook?.(routeStatus)
        throw errors_1.globalErrorHandler.parse(error)
      }
      swapStep.execution.status = types_1.Status.FAILED
      swapStep.execution.error = 'Failed to execute transaction'
      updateRouteStatusHook?.(routeStatus)
      throw errors_1.globalErrorHandler.parse(error)
    }
    updateRouteStatusHook?.(routeStatus)
    return txHash
  }
  async estimateGas(publicClient, args) {
    try {
      const {
        account,
        address,
        abi,
        functionName,
        args: functionArgs,
        value,
      } = args
      const data = (0, viem_1.encodeFunctionData)({
        abi,
        functionName,
        args: functionArgs,
      })
      const isOPStack = constants_1.SUPPORTED_OP_CHAINS[publicClient.chain.id]
      const gasLimit = isOPStack
        ? await publicClient
            .extend((0, op_stack_1.publicActionsL2)())
            .estimateTotalGas({
              data,
              account: account,
              to: address,
              value,
              chain: publicClient.chain,
            })
        : await publicClient.estimateGas({
            data,
            account: account,
            to: address,
            value,
          })
      return this.increaseGasByPercent(
        gasLimit,
        constants_1.ADDITIONAL_GAS_PERCENTAGE
      )
    } catch (error) {
      throw errors_1.globalErrorHandler.parse(error)
    }
  }
  increaseGasByPercent(gas, percent) {
    return gas + (gas / 100n) * BigInt(percent)
  }
  async handleTransactionStatus(
    txHash,
    publicClient,
    routeStatus,
    updateRouteStatusHook
  ) {
    const chainId = publicClient.chain?.id || 0
    const { status } = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      ...constants_1.viemReceiptConfig,
      confirmations: (0, constants_2.getChainConfirmations)(chainId),
    })
    if (!status || status === 'reverted') {
      this.setAllStepsData(
        routeStatus,
        types_1.Status.FAILED,
        'Transaction reverted',
        updateRouteStatusHook
      )
      return
    }
    const firstStepType = routeStatus.steps.find(
      ({ type }) =>
        type === types_1.StepType.SRC_SWAP || type === types_1.StepType.BRIDGE
    )
    const isBridgeStepExist = routeStatus.steps.some(
      ({ type }) => type === types_1.StepType.BRIDGE
    )
    if (
      status === 'success' &&
      firstStepType?.type === types_1.StepType.SRC_SWAP &&
      !isBridgeStepExist
    ) {
      let step
      do {
        ;[step] = await this.fetchRouteSteps(txHash)
        if (!step) {
          await new Promise((resolve) =>
            setTimeout(resolve, constants_1.DEFAULT_REQUEST_TIMEOUT_MS)
          )
        }
      } while (!step)
      firstStepType.execution.txHash = txHash
      firstStepType.execution.status = types_1.Status.SUCCESS
      if (step.receivedAmount) {
        firstStepType.execution.receivedAmount = step.receivedAmount
      }
      updateRouteStatusHook?.(routeStatus)
      return
    }
    await this.pollTransactionStatus(txHash, routeStatus, updateRouteStatusHook)
  }
  async pollTransactionStatus(txHash, routeStatus, updateRouteStatusHook) {
    let statusFromTx = types_1.Status.PENDING
    do {
      try {
        const steps = await this.fetchRouteSteps(txHash)
        if (steps.length > 0) {
          const { status } = this.evaluateStepsStatus(steps)
          statusFromTx = status
          if (statusFromTx !== types_1.Status.PENDING) {
            this.updateRouteSteps(routeStatus, steps, updateRouteStatusHook)
            return
          }
        }
        await (0, utils_1.sleep)(constants_1.DEFAULT_REQUEST_RETRY_INTERVAL_MS)
      } catch (error) {
        this.setAllStepsData(
          routeStatus,
          types_1.Status.FAILED,
          error,
          updateRouteStatusHook
        )
        await errors_1.globalErrorHandler.handle(error)
        throw errors_1.globalErrorHandler.parse(error)
      }
    } while (statusFromTx === types_1.Status.PENDING)
  }
  async fetchRouteSteps(txHash) {
    const options = new URLSearchParams({
      txHash,
      isTestnet: String(this.config.testnet),
    })
    const { data: steps } = await http_1.httpClient.get(
      configs_2.conceroApi.routeStatus,
      options
    )
    return steps
  }
  evaluateStepsStatus(steps) {
    const allSuccess = steps.every(
      ({ status }) => status === types_1.Status.SUCCESS
    )
    const anyFailed = steps.some(
      ({ status }) => status === types_1.Status.FAILED
    )
    if (allSuccess) {
      return { status: types_1.Status.SUCCESS }
    }
    if (anyFailed) {
      const error = steps[steps.length - 1].error
      return { status: types_1.Status.FAILED, error }
    }
    return { status: types_1.Status.PENDING }
  }
  updateRouteSteps(routeStatus, txSteps, updateRouteStatusHook) {
    let indexOfStep = 0
    routeStatus.steps.forEach((step) => {
      const isNewStep =
        step.type !== types_1.StepType.SWITCH_CHAIN &&
        step.type !== types_1.StepType.ALLOWANCE
      if (isNewStep) {
        step.execution = {
          ...step.execution,
          ...txSteps[indexOfStep++],
        }
      }
    })
    updateRouteStatusHook?.(routeStatus)
  }
  setAllStepsData(routeStatus, status, error, updateRouteStatusHook) {
    routeStatus.steps.forEach((step) => {
      if (
        step.type !== types_1.StepType.SWITCH_CHAIN &&
        step.type !== types_1.StepType.ALLOWANCE
      ) {
        step.execution.status = status
        step.execution.error = error
      }
    })
    updateRouteStatusHook?.(routeStatus)
  }
  prepareTransactionArgs(
    txArgs,
    clientAddress,
    firstSwapStep,
    destinationAddress
  ) {
    const { srcSwapData, bridgeData, dstSwapData } = txArgs
    const integrationInfo = {
      integrator: this.config.integratorAddress,
      feeBps: this.config.feeBps,
    }
    const recipient = destinationAddress ?? clientAddress
    let args = [srcSwapData, recipient, integrationInfo]
    let txName = 'swap'
    if (bridgeData) {
      const compressDstSwapData =
        dstSwapData.length > 0 ? this.compressSwapData(dstSwapData) : '0x'
      bridgeData.compressedDstSwapData = compressDstSwapData
      args = [bridgeData, integrationInfo]
      if (srcSwapData.length > 0) {
        txName = 'swapAndBridge'
        args.splice(1, 0, srcSwapData)
      } else {
        txName = 'bridge'
      }
    }
    const isFromNativeToken = (0, utils_1.isNative)(
      firstSwapStep.from.token.address
    )
    const fromAmount = BigInt(firstSwapStep.from.amount)
    return { txName, args, isFromNativeToken, fromAmount }
  }
  async computeV2TxValue(publicClient, conceroAddress, txArgs) {
    try {
      const selector = txArgs.bridgeData?.dstChainSelector
      const amount = BigInt(txArgs.bridgeData?.amount || 0)
      if (!selector) {
        return 0n
      }
      const fee = await publicClient.readContract({
        address: conceroAddress,
        abi: abi_1.conceroAbiV2,
        functionName: 'getFee',
        args: [selector, amount, viem_1.zeroAddress, 1000000],
      })
      return fee
    } catch (error) {
      throw errors_1.globalErrorHandler.parse(error)
    }
  }
  initRouteStepsStatuses(route) {
    return {
      ...route,
      steps: route.steps.map((step) => ({
        ...step,
        execution: {
          status: types_1.Status.NOT_STARTED,
        },
      })),
    }
  }
  buildRouteData(routeData, clientAddress, destinationAddress) {
    const { steps } = routeData
    let bridgeData = null
    const srcSwapData = []
    const dstSwapData = []
    steps.forEach((step) => {
      const { type } = step
      if (type === types_1.StepType.BRIDGE) {
        const { from, to } = step
        const fromAmount = BigInt(from.amount)
        bridgeData = {
          token: from.token.address,
          amount: fromAmount,
          dstChainSelector: this.config.testnet
            ? configs_1.v2ChainSelectors[to.chain.id]
            : configs_1.ccipChainSelectors[to.chain.id],
          receiver: destinationAddress ?? clientAddress,
          compressedDstSwapData: '0x',
        }
      } else if (
        type === types_1.StepType.SRC_SWAP ||
        type === types_1.StepType.DST_SWAP
      ) {
        step.internalSteps.forEach((internalStep) => {
          const swapData = this.buildSwapData(internalStep)
          if (bridgeData) {
            dstSwapData.push(swapData)
          } else {
            srcSwapData.push(swapData)
          }
        })
      }
    })
    return { srcSwapData, bridgeData, dstSwapData }
  }
  buildSwapData(step) {
    const { tool, from, to } = step
    const fromToken = from.token
    const toToken = to.token
    const { amountOutMin } = tool
    const { dexCallData, dexRouter } = tool.data
    const fromAmount = BigInt(from.amount)
    const toAmount = BigInt(to.amount)
    const toAmountMin = BigInt(amountOutMin)
    return {
      dexRouter,
      fromToken: fromToken.address,
      fromAmount,
      toToken: toToken.address,
      toAmount,
      toAmountMin,
      dexCallData,
    }
  }
  compressSwapData(swapDataArray) {
    const encodedSwapData = (0, viem_1.encodeAbiParameters)(
      [abi_1.swapDataAbi],
      [swapDataArray]
    )
    return solady_1.LibZip.cdCompress(encodedSwapData)
  }
}
exports.LancaClient = LancaClient
//# sourceMappingURL=LancaClient.js.map
