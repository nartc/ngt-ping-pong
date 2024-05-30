import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { extend, NgtArgs, NgtCanvas } from 'angular-three';
import { NgtcPhysics, NgtcPhysicsContent } from 'angular-three-cannon';
import * as THREE from 'three';
import { Ball } from './ball';
import { ContactGround } from './contact-ground';
import { Game } from './game';
import { Paddle } from './paddle';

extend(THREE);

@Component({
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ngt-color *args="['#171720']" attach="background" />
		<ngt-ambient-light [intensity]="0.5 * Math.PI" />
		<ngt-point-light [decay]="0" [intensity]="Math.PI" [position]="-10" />
		<ngt-spot-light castShadow [angle]="0.3" [decay]="0" [intensity]="Math.PI" [penumbra]="1" [position]="10">
			<ngt-vector2 *args="[2048, 2048]" attach="shadow.mapSize" />
			<ngt-value [rawValue]="-0.0001" attach="shadow.bias" />
		</ngt-spot-light>
		<ngtc-physics
			[iterations]="20"
			[tolerance]="0.0001"
			[defaultContactMaterial]="{
				contactEquationRelaxation: 1,
				contactEquationStiffness: 1e7,
				friction: 0.9,
				frictionEquationRelaxation: 2,
				frictionEquationStiffness: 1e7,
				restitution: 0.7
			}"
			[gravity]="[0, -40, 0]"
			[allowSleep]="false"
		>
			<ng-template physicsContent>
				<ngt-mesh [position]="[0, 0, -10]" receiveShadow>
					<ngt-plane-geometry *args="[1000, 1000]" />
					<ngt-mesh-phong-material color="#172017" />
				</ngt-mesh>

				<app-contact-ground />

				@if (game.isPlaying()) {
					<app-ball />
				}

				<app-paddle />
			</ng-template>
		</ngtc-physics>
	`,
	imports: [NgtArgs, NgtcPhysics, NgtcPhysicsContent, Ball, Paddle, ContactGround],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Experience {
	protected Math = Math;
	protected game = inject(Game);
}

@Component({
	selector: 'app-ping-pong',
	standalone: true,
	template: `
		<ngt-canvas
			[sceneGraph]="scene"
			[camera]="{ fov: 50, position: [0, 5, 12] }"
			shadows
			(pointerMissed)="game.start()"
		/>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [Game],
	imports: [NgtCanvas],
	styles: `
		:host {
			display: block;
			height: 100dvh;
		}
	`,
})
export class PingPong {
	protected scene = Experience;
	protected game = inject(Game);
}
