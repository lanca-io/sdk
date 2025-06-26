/*
 * Sleep for a given number of milliseconds.
 * @param ms - The number of milliseconds to sleep for.
 * @returns A promise that resolves after the given number of milliseconds.
 * @example
 * await sleep(1000)
 */
export function sleep(ms: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms)
  })
}
