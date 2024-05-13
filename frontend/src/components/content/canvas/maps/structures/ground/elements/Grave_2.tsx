/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/object/Grave_2.glb -t -o src/components/content/canvas/maps/structures/ground/elements/Grave_2.tsx 
*/

import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { ObjectSettingType } from '../../../../../../../types/GameType';

import { useBox } from '@react-three/cannon';

type GLTFResult = GLTF & {
    nodes: {
        Grave_2_Brown_2_0: THREE.Mesh;
        Grave_2_Gray_Blue_0: THREE.Mesh;
        Grave_2_Light_Gray_0: THREE.Mesh;
    };
    materials: {
        Brown_2: THREE.MeshStandardMaterial;
        Gray_Blue: THREE.MeshStandardMaterial;
        Light_Gray: THREE.MeshStandardMaterial;
    };
};

export function Grave_2(props: ObjectSettingType) {
    const { nodes, materials } = useGLTF(
        '/models/object/Grave_2.glb'
    ) as GLTFResult;

    const [ref] = useBox<THREE.Mesh>(() => ({
        args: [1, 1, 1],
        mass: 0.1,
        position: props.position,
        rotation: props.rotation,
        linearFactor: [0, 0, 0], // 모든 축에 대해 이동 제한
        angularFactor: [0, 0, 0], // 모든 축에 대해 회전 제한
    }));
    return (
        <group position={[0, 0, 0]} dispose={null}>
            <group>
                <mesh
                    ref={ref}
                    geometry={nodes.Grave_2_Brown_2_0.geometry}
                    material={materials.Brown_2}
                    position={props.position}
                    rotation={props.rotation}
                />
                <mesh
                    ref={ref}
                    geometry={nodes.Grave_2_Gray_Blue_0.geometry}
                    material={materials.Gray_Blue}
                    position={props.position}
                    rotation={props.rotation}
                />
                <mesh
                    ref={ref}
                    geometry={nodes.Grave_2_Light_Gray_0.geometry}
                    material={materials.Light_Gray}
                    position={props.position}
                    rotation={props.rotation}
                />
            </group>
        </group>
    );
}

useGLTF.preload('/models/object/Grave_2.glb');
