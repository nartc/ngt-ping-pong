import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgtArgs } from 'angular-three';

@Component({
	selector: 'app-wall',
	standalone: true,
	template: `
		<ngt-mesh [position]="[0, 0, -10]" receiveShadow>
			<ngt-plane-geometry *args="[1000, 1000]" />
			<ngt-mesh-phong-material color="#172017" />
		</ngt-mesh>
	`,
	imports: [NgtArgs],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Wall {}
