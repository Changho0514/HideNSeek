import { GroundElements } from './structures/ground';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { AttackRules } from './player/AttackRules';
import { useSelector } from 'react-redux';
import { CurrentPlayersInfo } from '../../../../types/GameType';
import { Animal } from './player/Animal';
import { ObjectPlayer } from './player/ObjectPlayer';

export function RootMap() {
    const camera = useThree((three) => three.camera);
    const controls = useRef<any>(null);

    const currentRoom = useSelector(
        (state: any) => state.reduxFlag.userSlice.currentRoom
    );

    useEffect(() => {
        if (!controls.current) return;
        camera.position.set(14, 14, 14);
        controls.current.target.set(0, 0, 0);
    }, [camera.position]);
    return (
        <>
            <>
                <GroundElements />
                {currentRoom.roomPlayers.map((player: CurrentPlayersInfo) => {
                    if (player.isSeeker && !player.isDead) {
                        return (
                            <>
                                {/* <Player
                                    key={player.id}
                                    player={player}
                                    position={
                                        new Vector3(
                                            player.position[0],
                                            player.position[1],
                                            player.position[2]
                                        )
                                    }
                                    modelIndex={selectedCharacterGlbNameIndex}
                                /> */}
                                <Animal
                                    player={player}
                                    position={
                                        new Vector3(
                                            player.position[0],
                                            player.position[1],
                                            player.position[2]
                                        )
                                    }
                                    modelIndex={
                                        player.selectedIndex
                                            ? player.selectedIndex
                                            : 0
                                    }
                                />
                            </>
                        );
                    } else {
                        if (player.selectedIndex !== null && !player.isDead) {
                            return (
                                <>
                                    <ObjectPlayer
                                        key={player.id}
                                        player={player}
                                        position={
                                            new Vector3(
                                                player.position[0],
                                                player.position[1],
                                                player.position[2]
                                            )
                                        }
                                        selectedIndex={player.selectedIndex}
                                    />
                                </>
                            );
                        } else {
                            return <></>;
                        }
                    }
                })}
                <AttackRules />
            </>
        </>
    );
}
