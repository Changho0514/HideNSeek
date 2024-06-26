/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/object/Tree_house_trunk.glb -t -o src/components/content/canvas/maps/structures/ground/elements/Tree_house_trunk.tsx 
*/

import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

import { ObjectSettingType } from '../../../../../../../types/GameType';

import { useBox } from '@react-three/cannon';
import React from 'react';

type GLTFResult = GLTF & {
    nodes: {
        Tree_house_trunk__Brown_2_0: THREE.Mesh;
        Tree_house_trunk__Brown_3_0: THREE.Mesh;
        Tree_house_trunk__Brown_4_0: THREE.Mesh;
        Tree_house_trunk__Brown__0: THREE.Mesh;
    };
    materials: {
        Brown_2: THREE.MeshStandardMaterial;
        Brown_3: THREE.MeshStandardMaterial;
        Brown_4: THREE.MeshStandardMaterial;
        Brown: THREE.MeshStandardMaterial;
    };
};

function Tree_house_trunkComponent(props: ObjectSettingType) {
    const { nodes, materials } = useGLTF(
        '/models/object/Tree_house_trunk.glb'
    ) as GLTFResult;

    const [ref] = useBox<THREE.Mesh>(() => ({
        args: [17, 17, 22],

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
                    geometry={nodes.Tree_house_trunk__Brown_2_0.geometry}
                    material={materials.Brown_2}
                    position={props.position}
                    rotation={props.rotation}
                    scale={[3, 3, 3]}
                />
                <mesh
                    ref={ref}
                    geometry={nodes.Tree_house_trunk__Brown_3_0.geometry}
                    material={materials.Brown_3}
                    position={props.position}
                    rotation={props.rotation}
                    scale={[3, 3, 3]}
                />
                <mesh
                    ref={ref}
                    geometry={nodes.Tree_house_trunk__Brown_4_0.geometry}
                    material={materials.Brown_4}
                    position={props.position}
                    rotation={props.rotation}
                    scale={[3, 3, 3]}
                />
                <mesh
                    ref={ref}
                    geometry={nodes.Tree_house_trunk__Brown__0.geometry}
                    material={materials.Brown}
                    position={props.position}
                    rotation={props.rotation}
                    scale={[3, 3, 3]}
                />
            </group>
        </group>
    );
}

useGLTF.preload('/models/object/Tree_house_trunk.glb');

function areEqual(prevProps: ObjectSettingType, nextProps: ObjectSettingType) {
    return (
        prevProps.position[0] === nextProps.position[0] &&
        prevProps.position[1] === nextProps.position[1] &&
        prevProps.position[2] === nextProps.position[2]
    );
}

export const Tree_house_trunk = React.memo(Tree_house_trunkComponent, areEqual);
