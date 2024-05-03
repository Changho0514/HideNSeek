import { useGLTF } from '@react-three/drei';
import { useFrame, useGraph } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Group, Mesh, MeshStandardMaterial, SkinnedMesh, Vector3, Quaternion } from 'three';
import { GLTF, SkeletonUtils } from 'three-stdlib';
import { PlayerInitType } from '../../../../../../types/GameType';
import StompClient from '../../../../../../websocket/StompClient';
import { useSelector } from 'react-redux';
import { useBox } from '@react-three/cannon';

// interface GLTFAction extends AnimationClip {
//     name: ActionName;
// }
type GLTFResult = GLTF & {
    nodes: {
        Barrel_1: Mesh;
        Cabinet_18: Mesh;
        Chair_11: Mesh;
        Chair_4: Mesh;
        Toy_Pig_1: Mesh;
        Kitchen_Cabinet_4: Mesh;
        Washstand_2: Mesh;
        Kitchen_Cabinet_5: Mesh;
        Kitchen_Cabinet_6: Mesh;
        Ladder_1: Mesh;
        Shelf_4: Mesh;
        Table_5: Mesh;
        Ham_1: Mesh;
        Ham_2: Mesh;
        Pot_2: Mesh;
        Pot_1: Mesh;
        Fridge_2: Mesh;
        Table_13: Mesh;
    };
    materials: {
        ['Cartoon_Room_Mat.002']: MeshStandardMaterial;
    };
    animations: any[];
};

class ObjectRef extends Group {
    viewUpDown: number = 0;
    viewLR: number = 0;
}

export const useObject = ({ player, position, modelIndex }: PlayerInitType) => {
    const playerNickname = player?.nickname;
    const keyState = useRef<{ [key: string]: boolean }>({});
    const [mouseWheelValue, setMouseWheelValue] = useState(Number);

    const stompClient = StompClient.getInstance();
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

    const memoizedPosition = useMemo(() => position, []);

    const playerRef = useRef<ObjectRef>(null);
    const nicknameRef = useRef<ObjectRef>(null); 
    const accumulatedTimeRef = useRef(0.0);   
    
    const { scene: scene_, materials } = useGLTF(
        (() => {
            switch (modelIndex) {
                case 0:
                    return '/models/object/Barrel.glb';
                case 1:
                    return '/models/object/Closet.glb';
                case 2:
                    return '/models/object/Chair_brown.glb';
                case 3:
                    return '/models/object/Chair_white.glb';
                case 4:
                    return '/models/object/Doll_pig.glb';
                case 5:
                    return '/models/object/Drawer_brown_1.glb';
                case 6:
                    return '/models/object/Drawer_brown_2.glb';
                case 7:
                    return '/models/object/Drawer_brown_3.glb';
                case 8:
                    return '/models/object/Drawer_brown_4.glb';
                case 9:
                    return '/models/object/Drawer_brown_5.glb';
                case 10:
                    return '/models/object/Ladder_brown.glb';
                case 11:
                    return '/models/object/Ladder_white.glb';
                case 12:
                    return '/models/object/LongTable_white.glb';
                case 13:
                    return '/models/object/Meet_full.glb';
                case 14:
                    return '/models/object/Meet_half.glb';
                case 15:
                    return '/models/object/Pot_orange.glb';
                case 16:
                    return '/models/object/Pot_pink.glb';
                case 17:
                    return '/models/object/Refrigerator.glb';
                case 18:
                    return '/models/object/RoundTable_brown.glb';
                case 19:
                    return '/models/object/Closet.glb';
                case 20:
                    return '/models/object/Closet.glb';
                case 20:
                    return '/models/object/Closet.glb';
                default:
                    return '/models/object/Closet.glb';
            }
        })()
    ) as GLTFResult;
    const getScaleByModelIndex = (index: number | undefined) => {
        const scaleValues: any = {
            0: 0.025,
            1: 0.025,
            2: 0.025,
            3: 0.025,
            4: 0.025,
            5: 0.025,
            6: 0.025,
            7: 0.025,
            8: 0.025,
            9: 0.025,
            10: 0.025,
            11: 0.025,
            12: 0.025,
            13: 0.025,
            14: 0.025,
            15: 0.025,
            16: 0.025,
            17: 0.025,
            18: 0.025,
            19: 0.025,
            20: 0.025,
        };
        if (index) {
            return scaleValues[index] || 1; // modelIndex에 해당하는 값이 없다면 기본값으로 1 사용
        } else {
            return -1;
        }
    };

    const scale = getScaleByModelIndex(modelIndex);

    //개별 모델링을 통하여 다른 객체임을 알려줘야한다.
    const scene = useMemo(() => {
        return SkeletonUtils.clone(scene_);
    }, []);
    const objectMap = useGraph(scene);
    const nodes = objectMap.nodes;
    const material = returnMaterial(modelIndex);
    const node = returnNode(modelIndex);

    const [ref] = useBox(() => ({
        mass: 0,
        args: [1, 1, 1],
        position: [position.x, position.y, position.z], // 초기 위치를 useRef의 현재 값으로 설정
        onCollide: (e) => {
            console.log('충돌', e);
        },
    }));

    const updateRotationX = (movementY: number) => {
        // 아래 위
        const rotationAmount = movementY * 0.02; // 회전 속도 조절

        if (playerRef.current) {
            // 시야각 제한
            const maxRotationX = Math.PI * 1.5;
            const minRotationX = -Math.PI * 1.5;
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
        //좌 우
        const rotationAmount = movementX * 0.0013; // 회전 속도 조절을 위해 상수를 곱합니다.
        if (playerRef.current) {
            // playerRef.current.rotation.y -= rotationAmount;
            playerRef.current.viewLR -= rotationAmount;
        }
    };

    const handleMouseWheel = (event: WheelEvent) => {
        // 마우스 휠을 위로 올릴 때
        if (event.deltaY < 0) {
            setMouseWheelValue((prevValue) => Math.min(12, prevValue + 1)); // 최댓값인 12를 넘지 않도록 설정
        }
        // 마우스 휠을 아래로 내릴 때
        else if (event.deltaY > 0) {
            setMouseWheelValue((prevValue) => Math.max(1, prevValue - 1)); // 최솟값인 1보다 작아지지 않도록 설정
        }  
    }; 

    const lockPointer = () => {
        const element = document.body;
        const requestPointerLock = element.requestPointerLock;
        requestPointerLock.call(element);
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
        document.addEventListener('wheel', handleMouseWheel);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('wheel', handleMouseWheel);
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            if (ref.current) {
                ref.current.name = playerNickname;
                console.log(ref.current);
            }
            playerRef.current.name = playerNickname;
            playerRef.current.userData.physicsName = playerNickname; // userData에 이름 추가
            playerRef.current.viewLR = 0;
        }
        if (ref.current) {
            // Mesh 객체를 찾아 이름을 할당합니다.
            const mesh = ref.current.children.find(
                (child) => child.type === 'Mesh'
            );
            if (mesh) {
                mesh.name = playerNickname;
            }
        }
    }, [playerNickname, ref]);
    // 키 입력
    useEffect(() => {
        const handleKeyDown = (event: any) => {
            keyState.current[event.key] = true;
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
    }, []);

    useFrame(({ camera , clock }) => {  
        if (!player || !playerRef.current) return; 

        if (meInfo?.nickname === playerNickname) {
            // 내 캐릭터의 경우
            lockPointer();
            
            const delta = clock.getDelta(); // 프레임 간 시간 간격을 가져옵니다. 
            accumulatedTimeRef.current += delta;
            // console.log(delta)

            const moveVector = new Vector3(
                (keyState.current['d'] ? 1 : 0) -
                    (keyState.current['a'] ? 1 : 0), // 수정: 오른쪽이면 1, 왼쪽이면 -1
                0,
                (keyState.current['w'] ? 1 : 0) -
                    (keyState.current['s'] ? 1 : 0) // 수정: 위쪽이면 1, 아래쪽이면 -1
            );

            if (keyState.current['q']) {
                playerRef.current.rotation.y += 0.05;
            }

            if (keyState.current['e']) {
                playerRef.current.rotation.y -= 0.05;
            }

            if (!moveVector.equals(new Vector3(0, 0, 0))) {
                // 이동중
                moveVector.normalize().multiplyScalar(0.2);

                const forward = new Vector3(
                    Math.sin(playerRef.current.viewLR), // viewLR 값으로 삼각함수를 통해 x 값을 설정
                    0,
                    Math.cos(playerRef.current.viewLR) // viewLR 값으로 삼각함수를 통해 z 값을 설정
                ).normalize(); // 벡터를 정규화하여 길이를 1로 만듭니다.

                const moveDirection = forward
                    .clone()
                    .multiplyScalar(moveVector.z)
                    .add(
                        new Vector3(-forward.z, 0, forward.x).multiplyScalar(
                            moveVector.x
                        )
                    );

                playerRef.current.position.add(moveDirection);
                // stomp로 이전
                if (accumulatedTimeRef.current >= 0.003) {
                    accumulatedTimeRef.current = 0;
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
                                    Math.cos(playerRef.current.rotation.y)],
                            },
                        })
                    );  
                }
            } else { // 고정된 상태
                // rotation값 stomp 
                if (accumulatedTimeRef.current >= 0.003) {
                    accumulatedTimeRef.current = 0;
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
                                    Math.cos(playerRef.current.rotation.y)],
                            },
                        })
                    ); 
                }  
            }  
            // 카메라 설정
            const playerPosition = playerRef.current.position.clone();   
            // 플레이어가 바라보는 곳
            const playerDirection = new Vector3(
                Math.sin(playerRef.current.viewLR),
                playerRef.current.viewUpDown + 5,
                Math.cos(playerRef.current.viewLR)
            );

            // 카메라 위치
            playerDirection.multiplyScalar(mouseWheelValue*2);
            camera.position.set(
                playerPosition.x - playerDirection.x,
                playerPosition.y + 8 - playerRef.current.viewUpDown,
                playerPosition.z - playerDirection.z
            );

            playerDirection.multiplyScalar(0.5);

            // 카메라가 바라볼 위치
            const carmeraTarget = new Vector3(
                playerPosition.x + playerDirection.x,
                0,
                playerPosition.z + playerDirection.z
            );
            camera.lookAt(carmeraTarget);
        } else {
            // 다른 플레이어의 캐릭터
            roomState.roomPlayers.forEach((otherPlayer: any) => {
                if (
                    otherPlayer.nickname !== meInfo?.nickname &&
                    otherPlayer.isSeeker === false
                ) {
                    const otherPlayerRef = playerRef.current;
                    if (otherPlayerRef) {
                        // 위치 적용
                        otherPlayerRef?.position.set(
                            otherPlayer.position[0],
                            otherPlayer.position[1],
                            otherPlayer.position[2]
                        );

                        // 방향 적용 
                        const rotationVector = new Vector3(otherPlayer.direction[0], otherPlayer.direction[1], otherPlayer.direction[2]);
                        rotationVector.normalize(); // 회전 벡터를 정규화합니다.
                        const forward = new Vector3(0, 0, -1).applyQuaternion(
                            new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), rotationVector)
                        );
                        otherPlayerRef.lookAt(otherPlayerRef.position.clone().add(forward)); 
                    }
                }
            });
        }

        if (nicknameRef.current) {
            nicknameRef.current.position.set(
                playerRef.current.position.x,
                playerRef.current.position.y + 3.5,
                playerRef.current.position.z
            );
            nicknameRef.current.lookAt(10000, 10000, 10000);
        }
    });

    return {
        meInfo,
        playerRef,
        memoizedPosition,
        playerNickname,
        scene,
        nicknameRef,
        scale,
        node,
        material,
    };
    function returnMaterial(num: number | undefined) {
        switch (num) {
            case 0:
                return materials['Cartoon_Room_Mat.002'];
            case 1:
                return materials['Cartoon_Room_Mat.002'];
            case 2:
                return materials['Cartoon_Room_Mat.002'];
            case 3:
                return materials['Cartoon_Room_Mat.002'];
            case 4:
                return materials['Cartoon_Room_Mat.002'];
            case 5:
                return materials['Cartoon_Room_Mat.002'];
            case 6:
                return materials['Cartoon_Room_Mat.002'];
            case 7:
                return materials['Cartoon_Room_Mat.002'];
            case 8:
                return materials['Cartoon_Room_Mat.002'];
            case 9:
                return materials['Cartoon_Room_Mat.002'];
            case 10:
                return materials['Cartoon_Room_Mat.002'];
            case 11:
                return materials['Cartoon_Room_Mat.002'];
            case 12:
                return materials['Cartoon_Room_Mat.002'];
            case 13:
                return materials['Cartoon_Room_Mat.002'];
            case 14:
                return materials['Cartoon_Room_Mat.002'];
            default:
                return materials['Cartoon_Room_Mat.002'];
        }
    }
    function returnNode(num: number | undefined) {
        switch (num) {
            case 0:
                return (nodes.Barrel_1 as SkinnedMesh).geometry;
            case 1:
                return (nodes.Cabinet_18 as SkinnedMesh).geometry;
            case 2:
                return (nodes.Chair_11 as SkinnedMesh).geometry;
            case 3:
                return (nodes.Chair_4 as SkinnedMesh).geometry;
            case 4:
                return (nodes.Toy_Pig_1 as SkinnedMesh).geometry;
            case 5:
                return (nodes.Kitchen_Cabinet_4 as SkinnedMesh).geometry;
            case 6:
                return (nodes.Washstand_2 as SkinnedMesh).geometry;
            case 7:
                return (nodes.Kitchen_Cabinet_5 as SkinnedMesh).geometry;
            case 8:
                return (nodes.Kitchen_Cabinet_5 as SkinnedMesh).geometry;
            case 9:
                return (nodes.Kitchen_Cabinet_6 as SkinnedMesh).geometry;
            case 10:
                return (nodes.Ladder_1 as SkinnedMesh).geometry;
            case 11:
                return (nodes.Shelf_4 as SkinnedMesh).geometry;
            case 12:
                return (nodes.Table_5 as SkinnedMesh).geometry;
            case 13:
                return (nodes.Ham_1 as SkinnedMesh).geometry;
            case 14:
                return (nodes.Ham_2 as SkinnedMesh).geometry;
            case 15:
                return (nodes.Pot_2 as SkinnedMesh).geometry;
            case 16:
                return (nodes.Pot_1 as SkinnedMesh).geometry;
            case 17:
                return (nodes.Fridge_2 as SkinnedMesh).geometry;
            case 18:
                return (nodes.Table_13 as SkinnedMesh).geometry;
            default:
                return (nodes.Cabinet_18 as SkinnedMesh).geometry;
        }
    }
};
