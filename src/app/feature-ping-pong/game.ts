import { computed, signal } from '@angular/core';
import { createInjectable } from 'ngxtension/create-injectable';

export const Game = createInjectable(() => {
	const ping = new Audio('./ping.mp3');
	const score = signal(0);
	const state = signal<'playing' | 'idle'>('idle');

	return {
		score: score.asReadonly(),

		isPlaying: computed(() => state() === 'playing'),
		isIdle: computed(() => state() === 'idle'),

		pong: (velocity: number) => {
			ping.currentTime = 0;
			ping.volume = Math.min(Math.max(velocity / 20, 0), 1);
			void ping.play();
			if (velocity > 4) {
				score.update((v) => v + 1);
			}
		},
		start: () => {
			if (state() === 'idle') {
				score.set(0);
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
