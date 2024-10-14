
export interface ConceroToken {
    address: string
    chainId: string
    decimals: number
    logoURL: string
    name: string
    symbol: string
    priceUsd: number
}

export interface ConceroChain {
    id: string
    explorerURL: string
    logoURL: string
    name: string
    //symbol: string;
}


export enum TxType {
    SRC_SWAP = "SRC_SWAP",
    BRIDGE = "BRIDGE",
    DST_SWAP = "DST_SWAP",
}


export interface RouteTool {
    name: string
    amountOutMin?: string
    logoURL: string
    params?: {
        deadline?: number
        sqrPrice?: string
        path?: string
    }
}

export interface RouteInternalStep {
    from: {
        token: ConceroToken
        chain: ConceroChain
        amount: string
    }
    to: {
        token: ConceroToken
        chain: ConceroChain
        amount: string
    }
    tool: RouteTool
}


export interface RouteStep {
    type: TxType
    from: {
        token: ConceroToken
        chain: ConceroChain
        amount: string
    }
    to: {
        token: ConceroToken
        chain: ConceroChain
        amount: string
    }
    internalSteps: RouteInternalStep[]
}

export interface RouteType {
    from: {
        token: ConceroToken
        chain: ConceroChain
        amount: string
    }
    to: {
        token: ConceroToken
        chain: ConceroChain
        amount: string
    }
    steps: RouteStep[]
}