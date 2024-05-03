import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { Mesh, Vector3 } from 'three';

const name = 'ground-jungleGym';
const scale = 0.8;
export function JungleGym() {
    const { scene } = useGLTF('/models/Jungle gym.glb');
    const position = useMemo(() => new Vector3(-12, 0, 6), []);
    const [ref] = useBox<Mesh>(() => ({
        args: [8, 8, 8],
        mass: 0.1,
        position: [8, 0, 8],
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
            visible
            ref={ref}
            name={name}
            scale={scale}
            position={position}
            object={scene}
        ></primitive>
    );
}
