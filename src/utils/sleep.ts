export const sleep = (ms: number): Promise<null> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(null), ms)
    })
}