import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { injectBody } from 'angular-three-cannon/body';
import { PingPongApi } from './ping-pong-api';

@Component({
	selector: 'app-contact-ground',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ngt-mesh [ref]="ground.ref" />
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContactGround {
	private pingPongApi = inject(PingPongApi);
	protected ground = injectBody('Plane', () => ({
		onCollide: () => this.pingPongApi.reset(true),
		position: [0, -10, 0],
		rotation: [-Math.PI / 2, 0, 0],
		type: 'Static',
	}));
}
