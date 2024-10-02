export class UnsupportedToken extends Error {
    /**
     * @param token The unsupported token
     */
    constructor(token: string) {
        super(`Unsupported token: ${token}`);
    }
}

export class UnsupportedChain extends Error {
    /**
     * @param chainId The unsupported chain
     */
    constructor(chainId: string) {
        super(`Unsupported chain: ${chainId}`);
    }
}