import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core';
import { injectNgtLoader } from 'angular-three';
import { FontLoader, TextGeometry } from 'three-stdlib';
import { PingPongApi } from './ping-pong-api';

@Component({
	selector: 'app-text',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (geometries(); as geometries) {
			<ngt-group [rotation]="rotation()" [position]="position()" [dispose]="null">
				@for (char of chars(); track $index) {
					<ngt-mesh [position]="[-(chars().length / 2) * 3.5 + $index * 3.5, 0, 0]" [geometry]="geometries[char]">
						<ngt-mesh-basic-material [color]="color()" [opacity]="0.5" transparent />
					</ngt-mesh>
				}
			</ngt-group>
		}
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Text {
	private pingPongApi = inject(PingPongApi);
	private fontData = injectNgtLoader(
		() => FontLoader,
		() => './firasans_regular.json',
	);
	protected geometries = computed(() => {
		const fontData = this.fontData();
		if (!fontData) return null;
		return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((number) => {
			return new TextGeometry(number, { font: fontData, height: 0.1, size: 5 });
		});
	});

	position = input([0, 0, 0]);
	rotation = input([0, 0, 0]);
	color = input('white');

	chars = computed(() => {
		return [...this.pingPongApi.count().toString()].map((char) => parseInt(char));
	});
}
