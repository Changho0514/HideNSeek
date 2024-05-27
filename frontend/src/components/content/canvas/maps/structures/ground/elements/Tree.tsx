import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { Mesh } from 'three';
import { SkeletonUtils } from 'three-stdlib';
import React from 'react';
const name = 'ground-tree';
interface ObjectType {
    position: number[];
}
function TreeComponent({ position }: ObjectType) {
    const { scene: scene_ } = useGLTF('/models/Tree.glb');
    const scene = useMemo(() => {
        return SkeletonUtils.clone(scene_);
    }, []);

    const [ref] = useBox<Mesh>(() => ({
        args: [4, 12, 6],
        mass: 0.1,
        position: [position[0], position[1], position[2]],
        linearFactor: [0, 0, 0], // 모든 축에 대해 이동 제한
        angularFactor: [0, 0, 0], // 모든 축에 대해 회전 제한
    }));
    useEffect(() => {
        scene.traverse((mesh) => {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        });
    }, [scene]);
    return (
        <primitive
            ref={ref}
            visible
            name={name}
            scale={1}
            position={position}
            object={scene}
        ></primitive>
    );
}

useGLTF.preload('/models/Tree.glb');

function areEqual(prevProps: ObjectType, nextProps: ObjectType) {
    return (
        prevProps.position[0] === nextProps.position[0] &&
        prevProps.position[1] === nextProps.position[1] &&
        prevProps.position[2] === nextProps.position[2]
    );
}

export default React.memo(TreeComponent, areEqual);

