import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState } from 'react';

export default function DrawCallCounter() {
    const { gl } = useThree();
    const [count, setCount] = useState(0);
    gl.info.autoReset = false;
    useFrame(() => {
        setCount(gl.info.render.calls);
        gl.info.reset();
    });
    return (
        <Html>
            <div className=" w-40 rounded-lg text-white bg-gray-400">
                Calls: {count}
            </div>
        </Html>
    );
}
