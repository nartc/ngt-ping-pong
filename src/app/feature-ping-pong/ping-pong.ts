import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { extend, NgtArgs, NgtCanvas } from 'angular-three';
import { NgtcPhysics, NgtcPhysicsContent } from 'angular-three-cannon';
import * as THREE from 'three';
import { Ball } from './ball';
import { ContactGround } from './contact-ground';
import { Game } from './game';
import { Lights } from './lights';
import { Paddle } from './paddle';
import { Wall } from './wall';

extend(THREE);

@Component({
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<app-lights />
		<app-wall />

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
				<app-contact-ground />

				@if (game.isPlaying()) {
					<app-ball />
				}

				<app-paddle />
			</ng-template>
		</ngtc-physics>
	`,
	imports: [NgtArgs, NgtcPhysics, NgtcPhysicsContent, Ball, Paddle, ContactGround, Wall, Lights],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Experience {
	protected game = inject(Game);
}

@Component({
	selector: 'app-ping-pong',
	standalone: true,
	template: `
		<ngt-canvas
			[sceneGraph]="scene"
			[camera]="{ fov: 50, position: [0, 5, 12] }"
			(pointerMissed)="game.start()"
			shadows
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
