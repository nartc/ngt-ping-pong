import { computed, signal } from '@angular/core';
import { createInjectable } from 'ngxtension/create-injectable';

export const Game = createInjectable(() => {
	const ping = new Audio('./ping.mp3');
	const count = signal(0);
	const state = signal<'playing' | 'idle'>('idle');

	return {
		count: count.asReadonly(),
		isPlaying: computed(() => state() === 'playing'),
		isIdle: computed(() => state() === 'idle'),
		pong: (velocity: number) => {
			ping.currentTime = 0;
			ping.volume = Math.min(Math.max(velocity / 20, 0), 1);
			void ping.play();
			if (velocity > 4) {
				count.update((v) => v + 1);
			}
		},
		start: () => {
			if (state() === 'idle') {
				count.set(0);
				state.set('playing');
			}
		},
		gameOver: () => {
			if (state() === 'playing') {
				state.set('idle');
			}
		},
	};
});
