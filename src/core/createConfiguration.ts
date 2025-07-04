import type { LancaConfiguration } from "../types/internal";
import { checkPackageUpdates } from "../utils/packages";
import { lancaConfiguration } from "./configuration";
import { name, version } from "../constants/version";

export function createLancaConfiguration(options: LancaConfiguration): LancaConfiguration {
    if (!options.integratorAddress) {
        throw new Error("[Lanca SDK] Integrator address is required");
    }

    const _configuration = lancaConfiguration.setConfig(options);
    if (!options.versionCheck && process.env.NODE_ENV !== 'development') {
        checkPackageUpdates(name, version)
    }

    return _configuration;
}