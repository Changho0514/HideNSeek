import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { Mesh } from 'three';
import { SkeletonUtils } from 'three-stdlib';

const name = 'ground-tree';
interface ObjectType {
    position: number[];
}
export function Tree({ position }: ObjectType) {
    const { scene: scene_ } = useGLTF('/models/Tree.glb');
    const scene = useMemo(() => {
        return SkeletonUtils.clone(scene_);
    }, []);

    const [ref] = useBox<Mesh>(() => ({
        args: [8, 8, 8],
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
