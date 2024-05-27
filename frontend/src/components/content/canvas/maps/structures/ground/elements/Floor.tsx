import { useLoader } from '@react-three/fiber';
import {
    Matrix4,
    Mesh,
    PlaneGeometry,
    RepeatWrapping,
    TextureLoader,
} from 'three';
import { groundMapSize } from '../../../../../../../data/constant';
import { useBox } from '@react-three/cannon';

export function Floor() {
    const sandTexture = useLoader(TextureLoader, '/sand.jpg');
    sandTexture.wrapS = RepeatWrapping;
    sandTexture.wrapT = RepeatWrapping;
    sandTexture.repeat.x = 5;
    sandTexture.repeat.y = 5;
    const [ref] = useBox<Mesh>(() => ({
        args: [groundMapSize, 0.1, groundMapSize],
        type: 'Static',
        mass: 0,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
    }));
    const geometry = new PlaneGeometry(groundMapSize, groundMapSize);
    geometry.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2)); // 직접 Geometry에 회전 적용

    return (
        <mesh
            ref={ref}
            castShadow
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position-y={-0.001}
        >
            <primitive object={geometry} attach="geometry" />
            <meshStandardMaterial map={sandTexture} />
        </mesh>
    );
}
