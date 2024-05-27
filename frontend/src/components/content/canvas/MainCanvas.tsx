import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, StatsGl } from '@react-three/drei';
import { RootMap } from './maps/RootMap';
import { Debug, Physics } from '@react-three/cannon';
import { Suspense } from 'react';
import DrawCallCounter from '../../utils/DrawCallCounter';

export function MainCanvas() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    // 키보드 이벤트

    return (
        <Suspense
            fallback={
                <div className="absolute flex justify-center items-center text-3xl">
                    <p>loading...</p>
                </div>
            }
        >
            <Canvas
                id="canvas"
                // gl={{ antialias: true }}
                // shadows
                camera={{
                    fov: 30,
                    aspect: aspectRatio,
                    near: 0.01,
                    far: 10000,
                    position: [12, 12, 12],
                }}
            >
                <Sky distance={200} sunPosition={[0, 1, 0]} />
                <ambientLight name="ambientLight" intensity={5} />
                <directionalLight
                    // castShadow
                    intensity={10}
                    position={[0, 50, -50]}
                    // shadow-normalBias={0.1}
                    // shadow-camera-left={-25}
                    // shadow-camera-right={25}
                    // shadow-camera-top={25}
                    // shadow-camera-bottom={-25}
                    // shadow-camera-near={0.1}
                    // shadow-camera-far={200}
                />
                <OrbitControls />

                <Physics>
                    {/* <Debug> */}
                    <RootMap />
                    {/* </Debug> */}
                </Physics>
                {/* 최적화 관련 */}
                {/* <StatsGl /> */}
                {/* <DrawCallCounter /> */}
            </Canvas>
        </Suspense>
    );
}
