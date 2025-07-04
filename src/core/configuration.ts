import type { LancaConfiguration } from "../types/internal"
import { ZeroAddress } from "../constants/addresses"

export const lancaConfiguration = (() => {
    const defaultConfig: LancaConfiguration = {
        integrator: '@lanca/sdk',
        integratorAddress: ZeroAddress,
        feeBps: 0n,
        debug: false,
    }

    let config: LancaConfiguration = { ...defaultConfig }
    let loadingPromise: Promise<void> | undefined

    return {
        set loading(promise: Promise<void>) {
            loadingPromise = promise
        },

        get loading(): Promise<void> | undefined {
            return loadingPromise
        },

        getConfig(): LancaConfiguration {
            return config
        },

        setConfig(options: Partial<LancaConfiguration>): LancaConfiguration {
            config = { ...config, ...options }
            return config
        },

        resetConfig(): LancaConfiguration {
            config = { ...defaultConfig }
            return config
        }
    }
})()
