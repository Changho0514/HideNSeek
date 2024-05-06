/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/object/Puzzle_4.glb -t -o src/components/content/canvas/maps/structures/ground/elements/Puzzle_4.tsx 
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { ObjectSettingType } from '../../../../../../../types/GameType';
import { useBox } from '@react-three/cannon';

type GLTFResult = GLTF & {
    nodes: {
        Puzzle_4: THREE.Mesh;
    };
    materials: {
        Cartoon_Room_Mat: THREE.MeshStandardMaterial;
    };
};

export function Model(props: ObjectSettingType) {
    const { nodes, materials } = useGLTF('/Puzzle_4.glb') as GLTFResult;
    const [ref] = useBox<THREE.Mesh>(() => ({
        args: [4, 4, 4],
        mass: 0.1,
        position: props.position,
        rotation: props.rotation,
        linearFactor: [0, 0, 0], // 모든 축에 대해 이동 제한
        angularFactor: [0, 0, 0], // 모든 축에 대해 회전 제한
    }));
    return (
        <group dispose={null}>
            <mesh
                ref={ref}
                geometry={nodes.Puzzle_4.geometry}
                material={materials.Cartoon_Room_Mat}
                position={props.position}
                rotation={props.rotation}
                scale={0.01}
            />
        </group>
    );
}

useGLTF.preload('/Puzzle_4.glb');
