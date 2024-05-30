import { signal } from '@angular/core';
import { createInjectable } from 'ngxtension/create-injectable';

export const PingPongApi = createInjectable(() => {
	const ping = new Audio('./ping.mp3');
	const count = signal(0);
	const welcome = signal(true);

	return {
		count: count.asReadonly(),
		welcome: welcome.asReadonly(),
		pong: (velocity: number) => {
			ping.currentTime = 0;
			ping.volume = Math.min(Math.max(velocity / 20, 0), 1);
			ping.play();
			if (velocity > 4) {
				count.update((v) => v + 1);
			}
		},
		reset: (shouldWelcome: boolean) => {
			count.update((v) => (shouldWelcome ? v : 0));
			welcome.set(shouldWelcome);
		},
	};
});
