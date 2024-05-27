import { useSelector } from 'react-redux';
import { BarElement } from './sets/BarElement';
import { BarFloor } from './sets/BarFloor';
import BarWall from './sets/BarWall';
import { FarmElement } from './sets/FarmElement';
import { FarmWall } from './sets/FarmWall';
import { FarmFloor } from './sets/FarmFloor';

export function GroundElements() {
    const currentRoom = useSelector(
        (state: any) => state.reduxFlag.userSlice.currentRoom
    );
    // console.log(currentRoom.roomMap);
    return (
        <>
            {/* <JungleGym />
            <Tree position={[-9, 0, -8]} />
            <Tree position={[10, 0, -10]} />
            <Tree position={[-3, 0, 20]} />
            <Tree position={[-8, 0, 22]} /> */}
            {/* <PineTrees position={[-30, 0, -30]} />
            <PineTrees position={[-20, 0, -30]} />
            <PineTrees position={[-30, 0, -20]} />
            <PineTrees position={[-20, 0, -20]} /> */}
            {/* <Floor /> */}
            {currentRoom.roomMap === 'farm' ? (
                <>
                    <FarmElement />
                    <FarmWall />
                    <FarmFloor />
                </>
            ) : (
                <>
                    <BarFloor />
                    <BarWall />
                    <BarElement />
                </>
            )}
        </>
    );
}
