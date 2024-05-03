import { Wall_white } from '../elements/Wall_white';

export default function BarWall() {
    return (
        <>
            <Wall_white position={[-35, 0, -35]} rotation={[0, 0, 0]} />
            <Wall_white position={[-25, 0, -35]} rotation={[0, 0, 0]} />
            <Wall_white position={[-15, 0, -35]} rotation={[0, 0, 0]} />
            <Wall_white position={[-5, 0, -35]} rotation={[0, 0, 0]} />
            <Wall_white position={[5, 0, -35]} rotation={[0, 0, 0]} />
            <Wall_white position={[15, 0, -35]} rotation={[0, 0, 0]} />
            <Wall_white position={[25, 0, -35]} rotation={[0, 0, 0]} />
            <Wall_white position={[-35, 0, 35]} rotation={[0, 0, 0]} />
            <Wall_white position={[-25, 0, 35]} rotation={[0, 0, 0]} />
            <Wall_white position={[-15, 0, 35]} rotation={[0, 0, 0]} />
            <Wall_white position={[-5, 0, 35]} rotation={[0, 0, 0]} />
            <Wall_white position={[5, 0, 35]} rotation={[0, 0, 0]} />
            <Wall_white position={[15, 0, 35]} rotation={[0, 0, 0]} />
            <Wall_white position={[25, 0, 35]} rotation={[0, 0, 0]} />
            <Wall_white position={[35, 0, 35]} rotation={[0, Math.PI / 2, 0]} />
            <Wall_white position={[35, 0, 25]} rotation={[0, Math.PI / 2, 0]} />
            <Wall_white position={[35, 0, 15]} rotation={[0, Math.PI / 2, 0]} />
            <Wall_white position={[35, 0, 5]} rotation={[0, Math.PI / 2, 0]} />
            <Wall_white position={[35, 0, -5]} rotation={[0, Math.PI / 2, 0]} />
            <Wall_white
                position={[35, 0, -15]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Wall_white
                position={[35, 0, -25]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Wall_white
                position={[-35, 0, 35]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Wall_white
                position={[-35, 0, 25]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Wall_white
                position={[-35, 0, 15]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Wall_white position={[-35, 0, 5]} rotation={[0, Math.PI / 2, 0]} />
            <Wall_white
                position={[-35, 0, -5]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Wall_white
                position={[-35, 0, -15]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Wall_white
                position={[-35, 0, -25]}
                rotation={[0, Math.PI / 2, 0]}
            />
        </>
    );
}
