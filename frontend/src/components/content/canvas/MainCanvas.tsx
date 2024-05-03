import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RootMap } from './maps/RootMap';
import { Physics } from '@react-three/cannon';
import { Suspense } from 'react';
export function MainCanvas() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    return (
        <Canvas
            id="canvas"
            gl={{ antialias: true }}
            shadows
            camera={{
                fov: 30,
                aspect: aspectRatio,
                near: 0.01,
                far: 100000,
                position: [12, 12, 12],
            }}
        >
            <ambientLight name="ambientLight" intensity={5} />
            <directionalLight
                castShadow
                intensity={10}
                position={[0, 50, -50]}
                shadow-normalBias={0.1}
                shadow-camera-left={-25}
                shadow-camera-right={25}
                shadow-camera-top={25}
                shadow-camera-bottom={-25}
                shadow-camera-near={0.1}
                shadow-camera-far={200}
            />
            <OrbitControls />
            <Suspense>
                <Physics>
                    {/* <Debug> */}
                    <RootMap />
                    {/* </Debug> */}
                </Physics>
            </Suspense>
        </Canvas>
    );
}
