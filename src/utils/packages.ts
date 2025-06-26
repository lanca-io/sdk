import { name, version } from '../constants/version'

export const checkPackageUpdates = async (pkgName: string, pkgVersion: string) => {
    try {
        const packageName = pkgName ?? name
        const res = await fetch(`https://registry.npmjs.org/${pkgName}/latest`)
        const body = await res.json()
        const latestVersion = body?.version
        const currentVersion = pkgVersion ?? version

        if (latestVersion > currentVersion) {
            console.warn(`${packageName} is outdated. Current: ${currentVersion}, Latest: ${latestVersion}`)
        }
    } catch (_) {}
}