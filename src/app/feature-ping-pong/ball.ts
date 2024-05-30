import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgtArgs } from 'angular-three';
import { injectBody } from 'angular-three-cannon/body';
import { injectNgtsTextureLoader } from 'angular-three-soba/loaders';

@Component({
	selector: 'app-ball',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ngt-mesh [ref]="ball.ref" castShadow>
			<ngt-sphere-geometry *args="[0.5, 64, 64]" />
			<ngt-mesh-standard-material [map]="map()" />
		</ngt-mesh>
	`,
	imports: [NgtArgs],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Ball {
	protected map = injectNgtsTextureLoader(() => './cross.jpg');
	protected ball = injectBody('Sphere', () => ({
		mass: 1,
		args: [0.5],
		position: [0, 5, 0],
	}));
}
