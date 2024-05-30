import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgtArgs } from 'angular-three';

@Component({
	selector: 'app-lights',
	standalone: true,
	imports: [NgtArgs],
	template: `
		<ngt-ambient-light [intensity]="0.5 * Math.PI" />
		<ngt-point-light [decay]="0" [intensity]="Math.PI" [position]="-10" />
		<ngt-spot-light castShadow [angle]="0.3" [decay]="0" [intensity]="Math.PI" [penumbra]="1" [position]="10">
			<ngt-vector2 *args="[2048, 2048]" attach="shadow.mapSize" />
			<ngt-value [rawValue]="-0.0001" attach="shadow.bias" />
		</ngt-spot-light>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Lights {
	protected Math = Math;
}
