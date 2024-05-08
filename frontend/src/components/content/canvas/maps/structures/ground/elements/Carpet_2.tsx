/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/object/Carpet_2.glb -t -o src/components/content/canvas/maps/structures/ground/elements/Carpet_2.tsx 
*/

import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { ObjectSettingType } from '../../../../../../../types/GameType';

type GLTFResult = GLTF & {
    nodes: {
        Carpet_8: THREE.Mesh;
    };
    materials: {
        Cartoon_Room_Mat: THREE.MeshStandardMaterial;
    };
};

export function Carpet_2(props: ObjectSettingType) {
    const { nodes, materials } = useGLTF(
        '/models/object/Carpet_2.glb'
    ) as GLTFResult;

    return (
        <group position={[0, 0.1, 0]} dispose={null}>
            <mesh
                geometry={nodes.Carpet_8.geometry}
                material={materials.Cartoon_Room_Mat}
                position={props.position}
                rotation={props.rotation}
                scale={0.025}
            />
        </group>
    );
}

useGLTF.preload('/models/object/Carpet_2.glb');
