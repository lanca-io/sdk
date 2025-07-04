import type { Address } from "viem"

export interface LancaConfiguration {
  integrator: string
  integratorAddress: Address
  feeBps: bigint
  debug: boolean
  versionCheck?: boolean
}

export interface SDKConfig extends Partial<Omit<LancaConfiguration, 'integrator'>> {
  integrator: string
}
