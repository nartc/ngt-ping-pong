import {
	ChangeDetectionStrategy,
	Component,
	computed,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	inject,
	Signal,
	viewChild,
} from '@angular/core';
import { injectBeforeRender, NgtArgs } from 'angular-three';
import { injectBody } from 'angular-three-cannon/body';
import { injectNgtsGLTFLoader } from 'angular-three-soba/loaders';
import lerp from 'lerp';
import { Group, Material, Mesh, Object3D, Skeleton } from 'three';
import { GLTF } from 'three-stdlib';
import { PingPongApi } from './ping-pong-api';
import { Text } from './text';

type PingPongGLTF = GLTF & {
	materials: Record<'foam' | 'glove' | 'lower' | 'side' | 'upper' | 'wood', Material>;
	nodes: Record<'Bone' | 'Bone003' | 'Bone006' | 'Bone010', Object3D> &
		Record<'mesh' | 'mesh_1' | 'mesh_2' | 'mesh_3' | 'mesh_4', Mesh> & {
			arm: Mesh & { skeleton: Skeleton };
		};
};

@Component({
	selector: 'app-paddle',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (pingPong(); as pingPong) {
			<ngt-mesh [ref]="paddle.ref" [dispose]="null">
				<ngt-group #model [position]="[-0.05, 0.37, 0.3]" [scale]="0.15">
					<app-text [rotation]="[-Math.PI / 2, 0, 0]" [position]="[0, 1, 2]" />
					<ngt-group [rotation]="[1.88, -0.35, 2.32]" [scale]="2.97">
						<ngt-primitive *args="[pingPong.nodes.Bone]" />
						<ngt-primitive *args="[pingPong.nodes.Bone003]" />
						<ngt-primitive *args="[pingPong.nodes.Bone006]" />
						<ngt-primitive *args="[pingPong.nodes.Bone010]" />
						<ngt-skinned-mesh
							castShadow
							receiveShadow
							[material]="pingPong.materials.glove"
							[geometry]="pingPong.nodes.arm.geometry"
							[skeleton]="pingPong.nodes.arm.skeleton"
						>
							<ngt-value attach="material.roughness" [rawValue]="1" />
						</ngt-skinned-mesh>
					</ngt-group>
					<ngt-group [rotation]="[0, -0.04, 0]" [scale]="141.94">
						<ngt-mesh
							castShadow
							receiveShadow
							[material]="pingPong.materials.wood"
							[geometry]="pingPong.nodes.mesh.geometry"
						/>
						<ngt-mesh
							castShadow
							receiveShadow
							[material]="pingPong.materials.side"
							[geometry]="pingPong.nodes.mesh_1.geometry"
						/>
						<ngt-mesh
							castShadow
							receiveShadow
							[material]="pingPong.materials.foam"
							[geometry]="pingPong.nodes.mesh_2.geometry"
						/>
						<ngt-mesh
							castShadow
							receiveShadow
							[material]="pingPong.materials.lower"
							[geometry]="pingPong.nodes.mesh_3.geometry"
						/>
						<ngt-mesh
							castShadow
							receiveShadow
							[material]="pingPong.materials.upper"
							[geometry]="pingPong.nodes.mesh_4.geometry"
						/>
					</ngt-group>
				</ngt-group>
			</ngt-mesh>
		}
	`,
	imports: [Text, NgtArgs],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Paddle {
	protected Math = Math;
	protected pingPongApi = inject(PingPongApi);

	protected paddle = injectBody('Box', () => ({
		args: [3.4, 1, 3],
		onCollide: (e) => this.pingPongApi.pong(e.contact.impactVelocity),
		type: 'Kinematic',
	}));

	private gltf = injectNgtsGLTFLoader(() => './pingpong.glb') as Signal<PingPongGLTF | null>;

	protected pingPong = computed(() => {
		const gltf = this.gltf();
		if (!gltf) return null;
		return { nodes: gltf.nodes, materials: gltf.materials };
	});

	private model = viewChild<ElementRef<Group>>('model');

	constructor() {
		const values = [0, 0];
		injectBeforeRender(({ pointer }) => {
			const model = this.model();
			values[0] = lerp(values[0], (pointer.x * Math.PI) / 5, 0.2);
			values[1] = lerp(values[1], (pointer.x * Math.PI) / 5, 0.2);
			this.paddle.api.position.set(pointer.x * 10, pointer.y * 5, 0);
			this.paddle.api.rotation.set(0, 0, values[1]);
			if (!model) return;
			model.nativeElement.rotation.x = lerp(
				model.nativeElement.rotation.x,
				this.pingPongApi.welcome() ? Math.PI / 2 : 0,
				0.2,
			);
			model.nativeElement.rotation.y = values[0];
		});
	}
}
