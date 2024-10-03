export const timer = (func: (num: number) => void) => {
	let counterTime = 1;

	const timerId = setInterval(() => {
		counterTime++;
		func(counterTime);
	}, 1000);

	return () => {
		clearInterval(timerId);
	};
};
