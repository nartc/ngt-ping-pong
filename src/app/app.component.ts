import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PingPong } from './feature-ping-pong/ping-pong';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [PingPong],
	template: `
		<app-ping-pong />
	`,
	styles: `
		:host {
			display: block;
			height: 100%;
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
