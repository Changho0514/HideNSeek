import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useGraph } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    AnimationClip,
    Bone,
    Group,
    MeshStandardMaterial,
    SkinnedMesh,
    Vector3,
    Quaternion,
} from 'three';
import {
    CollideObject,
    PlayerInitType,
} from '../../../../../../types/GameType';
import StompClient from '../../../../../../websocket/StompClient';
import { useSelector } from 'react-redux';
import { GLTF, SkeletonUtils } from 'three-stdlib';
import { removeCollideObjectState } from '../../../../../../store/user-slice';
import { store } from '../../../../../../store/store';

interface GLTFAction extends AnimationClip {
    name: ActionName;
}
type GLTFResult = GLTF & {
    nodes: {
        Character: SkinnedMesh;
        Root: Bone;
    };
    materials: {
        M_ArcticFox: MeshStandardMaterial;
        M_Cat: MeshStandardMaterial;
        M_Dog: MeshStandardMaterial;
        M_Dove: MeshStandardMaterial;
        M_Goldfish: MeshStandardMaterial;
        M_Mouse: MeshStandardMaterial;
        M_Parrot: MeshStandardMaterial;
        M_Penguin: MeshStandardMaterial;
        M_Pigeon: MeshStandardMaterial;
        M_Rabbit: MeshStandardMaterial;
        M_Reindeer: MeshStandardMaterial;
        M_SeaLion: MeshStandardMaterial;
        M_SnowOwl: MeshStandardMaterial;
        M_SnowWeasel: MeshStandardMaterial;
        M_Tortoise: MeshStandardMaterial;
    };
    animations: GLTFAction[];
};
interface PlayerRef extends Group {
    viewUpDown?: number;
}
type ActionName =
    | 'Attack'
    | 'Bounce'
    | 'Clicked'
    | 'Death'
    | 'Eat'
    | 'Fear'
    | 'Fly'
    | 'Hit'
    | 'Idle_A'
    | 'Idle_B'
    | 'Idle_C'
    | 'Jump'
    | 'Roll'
    | 'Run'
    | 'Sit'
    | 'Spin'
    | 'Swim'
    | 'Walk';

/** 플레이어의 행동과 모델을 제어한다 */
export const useAnimal = ({ player, position, modelIndex }: PlayerInitType) => {
    const [isWalking, setIsWalking] = useState(false);
    const keyState = useRef<{ [key: string]: boolean }>({});
    const [isJumping, setIsJumping] = useState(0);
    // Redux
    const playerNickname = player?.nickname;
    const meName = useSelector(
        (state: any) => state.reduxFlag.userSlice.userNickname
    );
    const meInfo = useSelector(
        (state: any) => state.reduxFlag.userSlice.meInfo
    );
    const roomId = useSelector(
        (state: any) => state.reduxFlag.userSlice.roomId
    );
    const roomState = useSelector(
        (state: any) => state.reduxFlag.userSlice.currentRoom
    );
    const collideState = useSelector(
        (state: any) => state.reduxFlag.userSlice.collideObj
    );

    const stompClient = StompClient.getInstance();

    const memoizedPosition = useMemo(() => position, []);
    const playerRef = useRef<PlayerRef>(null);
    const prevPosition = useRef<Vector3 | null>(null);
    const isFirstFrame = useRef(true);

    const { scene, materials, animations } = useGLTF(
        (() => {
            switch (modelIndex) {
                case 0:
                    return '/models/character/ArcticFox_Animations.glb';
                case 1:
                    return '/models/character/Cat_Animations.glb';
                case 2:
                    return '/models/character/Dog_Animations.glb';
                case 3:
                    return '/models/character/Dove_Animations.glb';
                case 4:
                    return '/models/character/Goldfish_Animations.glb';
                case 5:
                    return '/models/character/Mouse_Animations.glb';
                case 6:
                    return '/models/character/Parrot_Animations.glb';
                case 7:
                    return '/models/character/Penguin_Animations.glb';
                case 8:
                    return '/models/character/Pigeon_Animations.glb';
                case 9:
                    return '/models/character/Rabbit_Animations.glb';
                case 10:
                    return '/models/character/Reindeer_Animations.glb';
                case 11:
                    return '/models/character/SeaLion_Animations.glb';
                case 12:
                    return '/models/character/SnowOwl_Animations.glb';
                case 13:
                    return '/models/character/SnowWeasel_Animations.glb';
                case 14:
                    return '/models/character/Tortoise_Animations.glb';
                default:
                    return '/models/character/ArcticFox_Animations.glb';
            }
        })()
    ) as GLTFResult;
    const material = returnMaterial(modelIndex);

    //개별 모델링을 통하여 다른 객체임을 알려줘야한다.
    const clone = useMemo(() => SkeletonUtils.clone(scene), []);

    const objectMap = useGraph(clone);
    const nodes = objectMap.nodes;

    const [, setAnimation] = useState<any>([
        'Attack',
        'Bounce',
        'Clicked',
        'Death',
        'Eat',
        'Fear',
        'Fly',
        'Hit',
        'Idle_A',
        'Idle_B',
        'Idle_C',
        'Jump',
        'Roll',
        'Run',
        'Sit',
        'Spin',
        'Swim',
        'Walk',
    ]);
    const { actions } = useAnimations(animations, playerRef);

    const lockPointer = () => {
        const element = document.body;
        const requestPointerLock = element.requestPointerLock;
        requestPointerLock.call(element);
    };
    // const unlockPointer = () => {
    //     document.exitPointerLock();
    // };

    // lockPointer();
    // unlockPointer();

    const updateRotationX = (movementY: number) => {
        const rotationAmount = movementY * 0.001; // 회전 속도 조절을 위해 상수를 곱합니다.

        if (playerRef.current) {
            // 최대 최소값을 설정하여 너무 높거나 낮지 않도록 제한합니다.
            const maxRotationX = Math.PI / 4; // 45도
            const minRotationX = -Math.PI / 4; // -45도
            if (playerRef.current.viewUpDown) {
                playerRef.current.viewUpDown = Math.max(
                    minRotationX,
                    Math.min(
                        maxRotationX,
                        playerRef.current.viewUpDown - rotationAmount
                    )
                );
            } else {
                playerRef.current.viewUpDown = playerRef.current.rotation.x;
                playerRef.current.viewUpDown = Math.max(
                    minRotationX,
                    Math.min(
                        maxRotationX,
                        playerRef.current.viewUpDown - rotationAmount
                    )
                );
            }
        }
    };

    const updateRotationY = (movementX: number) => {
        const rotationAmount = movementX * 0.0013; // 회전 속도 조절을 위해 상수를 곱합니다.

        if (playerRef.current) {
            playerRef.current.rotation.y -= rotationAmount;
        }
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // 마우스 포인터가 고정된 상태에서의 마우스 이동량을 감지합니다.
            if (meInfo?.nickname === playerNickname) {
                const movementX = event.movementX || 0;
                const movementY = event.movementY || 0;
                updateRotationY(movementX);
                updateRotationX(movementY);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // 이동
    // useEffect(() => {
    //     if (isWalking) {
    //         lockPointer();
    //         actions[animation]?.reset().fadeIn(0.2).play();
    //     }
    //     return () => {
    //         actions[animation]?.fadeOut(0.5);
    //     };
    // }, [isWalking, animation, actions]);

    useEffect(() => {
        if (isWalking) {
            lockPointer();
            if (!actions['Walk']?.isRunning()) {
                // Run 상태가 아닌경우 Run으로
                actions['Walk']?.reset().fadeIn(0.2).play();
            }
        } else {
            // not walking
            if (actions['Walk']?.isRunning()) {
                actions['Idle_A']?.reset().fadeIn(0.2).play();
            }
        }
    }, [isWalking, actions, playerRef.current]);

    // 키 입력
    useEffect(() => {
        const handleKeyDown = (event: any) => {
            keyState.current[event.key] = true;
            if (event.code === 'Space' && isJumping === 0) {
                setIsJumping(1);
            }
        };

        const handleKeyUp = (event: any) => {
            keyState.current[event.key] = false;
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [isWalking]);
    useEffect(() => {
        if (isJumping === 1) {
            console.log('점프중입니다.');
            setTimeout(() => {
                console.log('점프 내려가는 중입니다.');
                setIsJumping(2);
            }, 600); // Return after half a second
            setTimeout(() => {
                console.log('점프 끝입니다.');
                setIsJumping(0);
            }, 1200);
        }
    }, [isJumping]);

    // Frame
    useFrame(({ camera }) => {
        if (isFirstFrame.current) {
            isFirstFrame.current = false;
            prevPosition.current = playerRef.current
                ? playerRef.current.position.clone()
                : null; // 처음 프레임에만 이전 포지션 초기화
        }

        if (!player || !playerRef.current) return;

        if (meInfo?.nickname === playerNickname) {
            // 내 캐릭터의 경우
            const moveVector = new Vector3(
                (keyState.current['a'] ? 1 : 0) -
                    (keyState.current['d'] ? 1 : 0),
                0,
                (keyState.current['s'] ? 1 : 0) -
                    (keyState.current['w'] ? 1 : 0)
            );

            if (!moveVector.equals(new Vector3(0, 0, 0)) || isJumping != 0) {
                // 이동중
                moveVector.normalize().multiplyScalar(0.2); // 속도조절
                setIsWalking(true);
                setAnimation('Walk');
                // 캐릭터가 바라보는 방향으로 이동 벡터를 회전시킵니다.
                const forward = new Vector3(0, 0, -1).applyQuaternion(
                    playerRef.current.quaternion
                );
                const moveDirection = forward
                    .clone()
                    .multiplyScalar(moveVector.z)
                    .add(
                        new Vector3(-forward.z, 0, forward.x).multiplyScalar(
                            moveVector.x
                        )
                    );
                if (isJumping === 1) {
                    moveDirection.y = 0.08;
                } else {
                    moveDirection.y = -0.08;
                }
                console.log(moveDirection);

                if (collideState.length > 0) {
                    console.log(moveDirection);
                    const originPos = playerRef.current.position.clone();
                    const newPos = originPos.clone().add(moveDirection);
                    collideState.map((item: CollideObject, index: number) => {
                        const centerX = (item.minX + item.maxX) / 2;
                        const centerY = (item.minY + item.maxZ) / 2;
                        const centerZ = (item.minY + item.maxZ) / 2;

                        if (
                            originPos.x >= item.minX - 1 &&
                            originPos.x <= item.maxX + 1 &&
                            originPos.y >= item.minY - 1 &&
                            originPos.y <= item.maxY + 1 &&
                            originPos.z >= item.minZ - 1 &&
                            originPos.z <= item.maxZ + 1
                        ) {
                            if (originPos.x < centerX) {
                                if (newPos.x > originPos.x) {
                                    moveDirection.x = 0;
                                }
                            } else if (originPos.x >= centerX) {
                                if (newPos.x <= originPos.x) {
                                    moveDirection.x = 0;
                                }
                            }
                            if (originPos.y < centerY) {
                                if (newPos.y > originPos.y) {
                                    moveDirection.y = 0;
                                }
                            } else if (originPos.y >= centerY) {
                                if (newPos.y <= originPos.y) {
                                    moveDirection.y = 0;
                                }
                            }
                            if (originPos.z < centerZ) {
                                if (newPos.z > originPos.z) {
                                    moveDirection.z = 0;
                                }
                            } else if (originPos.z >= centerZ) {
                                if (newPos.z <= originPos.z) {
                                    moveDirection.z = 0;
                                }
                            }
                            if (playerRef.current) {
                                if (playerRef.current.position.y <= 0) {
                                    playerRef.current.position.y = 0.1;
                                }
                                playerRef.current.position.add(moveDirection);
                            }
                        } else {
                            store.dispatch(removeCollideObjectState(index));
                        }
                    });
                } else {
                    if (playerRef.current.position.y <= 0) {
                        playerRef.current.position.y = 0.1;
                    }
                    playerRef.current.position.add(moveDirection);

                    console.log(playerRef.current.position);
                }

                stompClient.sendMessage(
                    `/player.move`,
                    JSON.stringify({
                        type: 'player.move',
                        roomId: roomId,
                        sender: meName,
                        data: {
                            nickname: meName,
                            position: [
                                playerRef.current.position.x,
                                playerRef.current.position.y,
                                playerRef.current.position.z,
                            ],
                            direction: [
                                moveDirection.x,
                                moveDirection.y,
                                moveDirection.z,
                            ],
                        },
                    })
                );
            } else {
                // 고정된 상태
                setIsWalking(false);
                setAnimation('Roll');
                
                stompClient.sendMessage(
                    `/player.move`,
                    JSON.stringify({
                        type: 'player.move',
                        roomId: roomId,
                        sender: meName,
                        data: {
                            nickname: meName,
                            position: [
                                playerRef.current.position.x,
                                playerRef.current.position.y,
                                playerRef.current.position.z,
                            ],
                            direction: [
                                Math.sin(playerRef.current.rotation.y),
                                0,
                                Math.cos(playerRef.current.rotation.y),
                            ],
                        },
                    })
                );
                setAnimation('Walk');
            }

            // 카메라 설정
            const playerPosition = playerRef.current.position.clone();
            playerPosition.setY(+3);

            const playerDirection = new Vector3( // 플레이어가 바라보는 곳
                Math.sin(playerRef.current.rotation.y),
                playerRef.current.viewUpDown, // 아래 위
                Math.cos(playerRef.current.rotation.y)
            );

            camera.position.set(
                playerPosition.x + playerDirection.x,
                playerPosition.y,
                playerPosition.z + playerDirection.z
            );
            const cameraTarget = playerPosition
                .clone()
                .add(playerDirection.multiplyScalar(3));
            camera.lookAt(cameraTarget); // 정면보다 더 앞으로 설정!
            camera.zoom = 0.6;
            camera.updateProjectionMatrix();
        } else {
            // 다른 플레이어의 캐릭터
            roomState.roomPlayers.forEach((otherPlayer: any) => {
                if (
                    otherPlayer.nickname !== meInfo?.nickname &&
                    otherPlayer.isSeeker === true
                ) {
                    const otherPlayerRef = playerRef.current;
                    if (otherPlayerRef) {
                        // 위치 적용
                        otherPlayerRef?.position.set(
                            otherPlayer.position[0],
                            otherPlayer.position[1],
                            otherPlayer.position[2]
                        );

                        const rotationVector = new Vector3(
                            otherPlayer.direction[0],
                            otherPlayer.direction[1],
                            otherPlayer.direction[2]
                        );
                        rotationVector.normalize(); // 회전 벡터를 정규화합니다.
                        const forward = new Vector3(0, 0, -1).applyQuaternion(
                            new Quaternion().setFromUnitVectors(
                                new Vector3(0, 0, -1),
                                rotationVector
                            )
                        );
                        otherPlayerRef.lookAt(
                            otherPlayerRef.position.clone().add(forward)
                        );

                        // walking 유무 처리
                        if (
                            prevPosition.current &&
                            !otherPlayerRef.position.equals(
                                prevPosition.current
                            )
                        ) {
                            setIsWalking(true);
                            prevPosition.current =
                                otherPlayerRef.position.clone();
                            // 부드럽게 보간 처리
                            otherPlayerRef.position.lerp(
                                prevPosition.current,
                                0.1
                            ); // 두 번째 인수는 보간 비율입니다.
                        } else {
                            setIsWalking(false);
                        }
                    }
                }
            });
        }
    });

    return {
        meInfo,
        playerRef,
        memoizedPosition,
        playerNickname,
        nodes,
        material,
    };

    function returnMaterial(num: number | undefined) {
        switch (num) {
            case 0:
                return materials.M_ArcticFox;
            case 1:
                return materials.M_Cat;
            case 2:
                return materials.M_Dog;
            case 3:
                return materials.M_Dove;
            case 4:
                return materials.M_Goldfish;
            case 5:
                return materials.M_Mouse;
            case 6:
                return materials.M_Parrot;
            case 7:
                return materials.M_Penguin;
            case 8:
                return materials.M_Pigeon;
            case 9:
                return materials.M_Rabbit;
            case 10:
                return materials.M_Reindeer;
            case 11:
                return materials.M_SeaLion;
            case 12:
                return materials.M_SnowOwl;
            case 13:
                return materials.M_SnowWeasel;
            case 14:
                return materials.M_Tortoise;
            default:
                return materials.M_Penguin;
        }
    }
};
