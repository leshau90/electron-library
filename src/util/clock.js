import { readable } from 'svelte/store';


export const clock = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date().toLocaleTimeString());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});
