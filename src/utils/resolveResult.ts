import { sleep } from "./sleep";

export const resolveResult = async <T>(
  fn: () => Promise<T | undefined>,
  interval = 5000,
  maxRetries = 3,
  shouldRetry: (count: number, error: unknown) => boolean = () => true
): Promise<T> => {
  let result: T | undefined
  let attempts = 0

  while (!result) {
    try {
      result = await fn()
      if (!result) {
        await sleep(interval)
      }
    } catch (error) {
      if (!shouldRetry(attempts, error)) {
        throw error
      }
      attempts++
      if (attempts === maxRetries) {
        throw error
      }
      await sleep(interval)
    }
  }

  return result
}