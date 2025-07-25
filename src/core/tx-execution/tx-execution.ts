    
    
    
    
    
    
    
    
    
    
    
    
    
    
    private async handleTransaction(
        publicClient: PublicClient,
        walletClient: WalletClient,
        conceroAddress: Address,
        clientAddress: Address,
        txArgs: IInputRouteData,
        routeStatus: IRouteType,
        destinationAddress?: Address,
        updateRouteStatusHook?: UpdateRouteHook,
    ): Promise<Hash> {
        const swapStep: IRouteStep = routeStatus.steps.find(
            ({ type }) => type === StepType.SRC_SWAP || type === StepType.BRIDGE,
        ) as IRouteStep

        swapStep!.execution!.status = Status.PENDING
        updateRouteStatusHook?.(routeStatus)

        const { txName, args, isFromNativeToken, fromAmount } = prepareData(
            txArgs,
            clientAddress,
            swapStep,
            this.config.integratorAddress,
            this.config.feeBps,
            destinationAddress,
        )

        let txHash: Hash
        let txValue: bigint

        if (this.config.testnet) {
            txValue = await this.computeV2TxValue(publicClient, conceroAddress, txArgs)
        } else {
            txValue = isFromNativeToken ? fromAmount : 0n
        }

        const abi = this.config.testnet ? conceroAbiV2 : conceroAbiV1_7

        const contractArgs: EstimateContractGasParameters = {
            account: walletClient.account!,
            abi: abi,
            functionName: txName,
            address: conceroAddress,
            args,
            value: txValue,
        }

        try {
            let argsWithGas = { ...contractArgs, chain: publicClient.chain }
            if (!this.config.testnet) {
                const gasEstimate = await estimateGas(
                    publicClient,
                    walletClient.account!,
                    conceroAddress,
                    abi,
                    txName,
                    args,
                    txValue,
                )
                argsWithGas = { ...argsWithGas, gas: gasEstimate }
            }
            const { request } = await publicClient.simulateContract(argsWithGas)

            const hash = await walletClient.writeContract(request)
            if (!hash) {
                swapStep!.execution!.status = Status.FAILED
                swapStep!.execution!.error = 'Failed to obtain the transaction hash'
                updateRouteStatusHook?.(routeStatus)
                throw new LancaClientError('TransactionError', 'Failed to obtain the transaction hash')
            }
            txHash = hash.toLowerCase() as Hash
            ;(swapStep!.execution! as ITxStepSwap).txHash = txHash
        } catch (error) {
            if (
                error instanceof UserRejectedRequestError ||
                (error instanceof ContractFunctionExecutionError && error.message && error.message.includes('rejected'))
            ) {
                swapStep!.execution!.status = Status.REJECTED
                swapStep!.execution!.error = 'User rejected the request'
                updateRouteStatusHook?.(routeStatus)
                throw globalErrorHandler.parse(error)
            }
            swapStep!.execution!.status = Status.FAILED
            swapStep!.execution!.error = 'Failed to execute transaction'
            updateRouteStatusHook?.(routeStatus)
            throw globalErrorHandler.parse(error)
        }

        updateRouteStatusHook?.(routeStatus)
        return txHash
    }