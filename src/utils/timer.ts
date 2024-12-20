/**
 * Timer function that calls the given function every second with an increasing counter argument.
 *
 * @param {function} func - The function to be called every second.
 * @returns {function} A function that can be called to stop the timer.
 */
export const timer = (func: (num: number) => void) => {
	let counterTime = 1

	const timerId = setInterval(() => {
		counterTime++
		func(counterTime)
	}, 1000)

	return () => {
		clearInterval(timerId)
	}
}
