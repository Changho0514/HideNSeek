import { useGLTF } from '@react-three/drei';
import { useFrame, useGraph } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Group,
    Mesh,
    MeshStandardMaterial,
    SkinnedMesh,
    Vector3,
    Quaternion,
    Euler,
} from 'three';
import { GLTF, SkeletonUtils } from 'three-stdlib';
import {
    CollideObject,
    PlayerInitType,
} from '../../../../../../types/GameType';
import StompClient from '../../../../../../websocket/StompClient';
import { useSelector } from 'react-redux';
import { store } from '../../../../../../store/store';
import {
    removeCollideObjectState,
    observerState,
    observserModeState,
    cameraPositionState,
    currentRoomState,
} from '../../../../../../store/user-slice';
import { current } from '@reduxjs/toolkit';

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
        Armchair_1: Mesh;
        Armchair_2: Mesh;
        Basket_2: Mesh;
        Bath_1: Mesh;
        Bed_2: Mesh;
        Bed_6: Mesh;
        Bed_3: Mesh;
        Books_6: Mesh;
        Books_8: Mesh;
        Books_4: Mesh;
        Books_2: Mesh;
        Books_15: Mesh;
        Bottle_20: Mesh;
        Bottle_22: Mesh;
        Box_7: Mesh;
        Bread_1: Mesh;
        Cactus_5: Mesh;
        Cactus_6: Mesh;
        Cactus_4: Mesh;
        Cake_1: Mesh;
        Carpet_16: Mesh;
        Carpet_8: Mesh;
        Chair_5: Mesh;
        Clock_1: Mesh;
        Coffee_Drink_1: Mesh;
        Cup_1: Mesh;
        Cup_2: Mesh;
        Toy_1: Mesh;
        Chicken_Toy_1: Mesh;
        Toy_Mushroom_1: Mesh;
        Toy_Mushroom_2: Mesh;
        Toy_Cat_1: Mesh;
        Toy_Rabbit_1: Mesh;
        Cabinet_19: Mesh;
        Kitchen_Cabinet_3: Mesh;
        Flower_5: Mesh;
        Flower_2: Mesh;
        Flower_1: Mesh;
        Vase_with_Flowers_1: Mesh;
        Vase_with_Flowers_3: Mesh;
        Flower_6: Mesh;
        Flower_7: Mesh;
        Flower_8: Mesh;
        Flower_9: Mesh;
        Flower_10: Mesh;
        Spatula_1: Mesh;
        Painting_18: Mesh;
        Painting_19: Mesh;
        Painting_20: Mesh;
        Childrens_Drawing_3: Mesh;
        Childrens_Drawing_1: Mesh;
        Childrens_Drawing_2: Mesh;
        Flags_1: Mesh;
        Mannequin_1: Mesh;
        Mirror_1: Mesh;
        Ottoman_1: Mesh;
        Ottoman_2: Mesh;
        Ottoman_3: Mesh;
        Plate_1: Mesh;
        Plate_3: Mesh;
        Pot_Full_1: Mesh;
        Present_1: Mesh;
        Present_2: Mesh;
        Present_3: Mesh;
        Puzzle_1: Mesh;
        Puzzle_2: Mesh;
        Puzzle_3: Mesh;
        Puzzle_4: Mesh;
        Table_6: Mesh;
        Sandwich_1: Mesh;
        Sausages_1: Mesh;
        Sewing_machine_1: Mesh;
        Couch_5: Mesh;
        Couch_1: Mesh;
        Towels_1: Mesh;
        Towels_2: Mesh;
        TV_1: Mesh;
        Plant_44: Mesh;
        Plant_60: Mesh;
        Plant_65: Mesh;
        Tree_1: Mesh;
        Plant_17: Mesh;
        Axe_Brown_4_0: Mesh;
        Axe_Gray_0: Mesh;
    };
    materials: {
        Cartoon_Room_Mat: MeshStandardMaterial;
        ['Cartoon_Room_Mat.002']: MeshStandardMaterial;

        Dark_Gray: MeshStandardMaterial;
        Light_Gray: MeshStandardMaterial;
        material: MeshStandardMaterial;
        Brown_3: MeshStandardMaterial;
        Gray: MeshStandardMaterial;
        Brown_4: MeshStandardMaterial;
        Brown: MeshStandardMaterial;
        Forest_Green: MeshStandardMaterial;
        Gold: MeshStandardMaterial;
        Grass_Green: MeshStandardMaterial;
        Yellow: MeshStandardMaterial;
        Pink: MeshStandardMaterial;
        Orange: MeshStandardMaterial;
        Brown_2: MeshStandardMaterial;
        Gray_Blue: MeshStandardMaterial;
        Yellow_2: MeshStandardMaterial;
        Blue: MeshStandardMaterial;
        Black: MeshStandardMaterial;
        Dark_Blue: MeshStandardMaterial;
        Gray_Blue_12: MeshStandardMaterial;
        Purple_2: MeshStandardMaterial;
        Purple_3: MeshStandardMaterial;
        Purple_4: MeshStandardMaterial;
        Blue_2: MeshStandardMaterial;
        Green: MeshStandardMaterial;
    };
    animations: any[];
};

class ObjectRef extends Group {
    viewUpDown: number = 0;
    viewLR: number = 0;
}

class Observer {
    position: Vector3 = new Vector3(0, 0, 0);
    viewUpDown: number = 0;
    viewLR: number = 0;
}

export const useObject = ({ player, position, modelIndex }: PlayerInitType) => {
    const playerNickname = player?.nickname;
    const keyState = useRef<{ [key: string]: boolean }>({});
    const [isJumping, setIsJumping] = useState(0);
    const [mouseWheelValue, setMouseWheelValue] = useState<number>(10);
    const [jumpFlag, setJumpFlag] = useState<boolean>(false);
    const [freeViewMode, setFreeViewMode] = useState(false);
    const [callsInLastSecond, setCallsInLastSecond] = useState(0);
    const [delay, setDelay] = useState(0.00008);

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
    const mapState = useSelector(
        (state: any) => state.reduxFlag.userSlice.mapSize
    );
    const collideState = useSelector(
        (state: any) => state.reduxFlag.userSlice.collideObj
    );
    const chatFlag = useSelector(
        (state: any) => state.reduxFlag.userSlice.chatFlag
    );
    const myCameraPosition = useSelector(
        (state: any) => state.reduxFlag.userSlice.cameraPosition
    );

    const initialHeight = returnHeightSize(modelIndex);
    position.y = initialHeight;

    const memoizedPosition = useMemo(() => position, []);
    const playerRef = useRef<ObjectRef>(null);
    const nicknameRef = useRef<ObjectRef>(null);
    const accumulatedTimeRef = useRef(0.0);
    const observerRef = useRef<Observer | null>(null);
    const [observedPlayerIndex, setObservedPlayerIndex] = useState(0);
    const callsInLastSecondRef = useRef(callsInLastSecond);

    const { scene: scene, materials } = useGLTF(
        (() => {
            if (roomState.roomMap === 'richRoom') {
                switch (modelIndex) {
                    case 0:
                        return '/models/object/Barrel.glb';
                    case 1:
                        return '/models/object/Barrel.glb';
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
                        return '/models/object/Armchair_1.glb';
                    case 20:
                        return '/models/object/Armchair_2.glb';
                    case 21:
                        return '/models/object/Basket_1.glb';
                    case 22:
                        return '/models/object/Bath_1.glb';
                    case 23:
                        return '/models/object/Bed_1.glb';
                    case 24:
                        return '/models/object/Bed_2.glb';
                    case 25:
                        return '/models/object/Bed_3.glb';
                    case 26:
                        return '/models/object/Book_1.glb';
                    case 27:
                        return '/models/object/Book_2.glb';
                    case 28:
                        return '/models/object/Book_3.glb';
                    case 29:
                        return '/models/object/Book_4.glb';
                    case 30:
                        return '/models/object/Book_5.glb';
                    case 31:
                        return '/models/object/Bottle_1.glb';
                    case 32:
                        return '/models/object/Bottle_2.glb';
                    case 33:
                        return '/models/object/Box_1.glb';
                    case 34:
                        return '/models/object/Bread.glb';
                    case 35:
                        return '/models/object/Cactus_1.glb';
                    case 36:
                        return '/models/object/Cactus_2.glb';
                    case 37:
                        return '/models/object/Cactus_3.glb';
                    case 38:
                        return '/models/object/Cake.glb';
                    case 39:
                        return '/models/object/Carpet_1.glb';
                    case 40:
                        return '/models/object/Carpet_2.glb';
                    case 41:
                        return '/models/object/Chair_orange.glb';
                    case 42:
                        return '/models/object/Clock_1.glb';
                    case 43:
                        return '/models/object/Coffee_drink.glb';
                    case 44:
                        return '/models/object/Cup_1.glb';
                    case 45:
                        return '/models/object/Cup_2.glb';
                    case 46:
                        return '/models/object/Doll_bear.glb';
                    case 47:
                        return '/models/object/Doll_Chick.glb';
                    case 48:
                        return '/models/object/Doll_mushroom_1.glb';
                    case 49:
                        return '/models/object/Doll_mushroom_2.glb';
                    case 50:
                        return '/models/object/Doll_Polar.glb';
                    case 51:
                        return '/models/object/Doll_rabbit.glb';
                    case 52:
                        return '/models/object/Drawer_blue_1.glb';
                    case 53:
                        return '/models/object/Drawer_pink_1.glb';
                    case 54:
                        return '/models/object/Flower_1.glb';
                    case 55:
                        return '/models/object/Flower_2.glb';
                    case 56:
                        return '/models/object/Flower_3.glb';
                    case 57:
                        return '/models/object/Flower_5.glb';
                    case 58:
                        return '/models/object/Flower_6.glb';
                    case 59:
                        return '/models/object/Flower_7.glb';
                    case 60:
                        return '/models/object/Flower_8.glb';
                    case 61:
                        return '/models/object/Flower_9.glb';
                    case 62:
                        return '/models/object/Flower_10.glb';
                    case 63:
                        return '/models/object/Flower_11.glb';
                    case 64:
                        return '/models/object/Fork.glb';
                    case 65:
                        return '/models/object/Frame_1.glb';
                    case 66:
                        return '/models/object/Frame_2.glb';
                    case 67:
                        return '/models/object/Frame_3.glb';
                    case 68:
                        return '/models/object/Frame_5.glb';
                    case 69:
                        return '/models/object/Frame_6.glb';
                    case 70:
                        return '/models/object/Frame_7.glb';
                    case 71:
                        return '/models/object/Frame_8.glb';
                    case 72:
                        return '/models/object/Mannequin_1.glb';
                    case 73:
                        return '/models/object/Mirror_1.glb';
                    case 74:
                        return '/models/object/Ottoman_1.glb';
                    case 75:
                        return '/models/object/Ottoman_2.glb';
                    case 76:
                        return '/models/object/Ottoman_3.glb';
                    case 77:
                        return '/models/object/Plate_1.glb';
                    case 78:
                        return '/models/object/Plate_2.glb';
                    case 79:
                        return '/models/object/Pot_full.glb';
                    case 80:
                        return '/models/object/Present_1.glb';
                    case 81:
                        return '/models/object/Present_2.glb';
                    case 82:
                        return '/models/object/Present_3.glb';
                    case 83:
                        return '/models/object/Puzzle_1.glb';
                    case 84:
                        return '/models/object/Puzzle_2.glb';
                    case 85:
                        return '/models/object/Puzzle_3.glb';
                    case 86:
                        return '/models/object/Puzzle_4.glb';
                    case 87:
                        return '/models/object/RoundTable_orange.glb';
                    case 88:
                        return '/models/object/Sandwich_1.glb';
                    case 89:
                        return '/models/object/Sausages_1.glb';
                    case 90:
                        return '/models/object/Sewing_machine.glb';
                    case 91:
                        return '/models/object/Sofa_1.glb';
                    case 92:
                        return '/models/object/Sofa_2.glb';
                    case 93:
                        return '/models/object/Towels_1.glb';
                    case 94:
                        return '/models/object/Towels_2.glb';
                    case 95:
                        return '/models/object/Tv.glb';
                    case 96:
                        return '/models/object/Vase_1.glb';
                    case 97:
                        return '/models/object/Vase_2.glb';
                    case 98:
                        return '/models/object/Vase_3.glb';
                    case 99:
                        return '/models/object/Vase_4.glb';
                    case 100:
                        return '/models/object/Vase_5.glb';

                    default:
                        return '/models/object/Closet.glb';
                }
            } else if (roomState.roomMap === 'farm') {
                switch (modelIndex) {
                    case 0:
                        return '/models/object/Axe.glb';
                    case 1:
                        return '/models/object/Axe.glb';
                    case 2:
                        return '/models/object/Barn.glb';
                    case 3:
                        return '/models/object/Barrel_2.glb';
                    case 4:
                        return '/models/object/Bench_2.glb';
                    case 5:
                        return '/models/object/Bridge_1.glb';
                    case 6:
                        return '/models/object/Bridge_2.glb';
                    case 7:
                        return '/models/object/Bush_1.glb';
                    case 8:
                        return '/models/object/Bush_2.glb';
                    case 9:
                        return '/models/object/Bush_3.glb';
                    case 10:
                        return '/models/object/Bush_4.glb';
                    case 11:
                        return '/models/object/Bush_5.glb';
                    case 12:
                        return '/models/object/Bush_6.glb';
                    case 13:
                        return '/models/object/Bush.glb';
                    case 14:
                        return '/models/object/Carrot.glb';
                    case 15:
                        return '/models/object/Chalk_Board.glb';
                    case 16:
                        return '/models/object/Chicken_coop.glb';
                    case 17:
                        return '/models/object/Dumpster.glb';
                    case 18:
                        return '/models/object/Fence.glb';
                    case 19:
                        return '/models/object/Fork_2.glb';
                    case 20:
                        return '/models/object/Grass.glb';
                    case 21:
                        return '/models/object/Grave_1.glb';
                    case 22:
                        return '/models/object/Grave_2.glb';
                    case 23:
                        return '/models/object/Hay_1.glb';
                    case 24:
                        return '/models/object/House_1.glb';
                    case 25:
                        return '/models/object/House_2.glb';
                    case 26:
                        return '/models/object/House_3.glb';
                    case 27:
                        return '/models/object/House_4.glb';
                    case 28:
                        return '/models/object/House_5.glb';
                    case 29:
                        return '/models/object/House_6.glb';
                    case 30:
                        return '/models/object/House_7.glb';
                    case 31:
                        return '/models/object/Light_pole_1.glb';
                    case 32:
                        return '/models/object/Light_pole_2.glb';
                    case 33:
                        return '/models/object/Logs.glb';
                    case 34:
                        return '/models/object/Pumpkin.glb';
                    case 35:
                        return '/models/object/Rock.glb';
                    case 36:
                        return '/models/object/Scythe.glb';
                    case 37:
                        return '/models/object/Traffic_light_1.glb';
                    case 38:
                        return '/models/object/Traffic_light_2.glb';
                    case 39:
                        return '/models/object/Tree_1.glb';
                    case 40:
                        return '/models/object/Tree_2.glb';
                    case 41:
                        return '/models/object/Tree_4.glb';
                    case 42:
                        return '/models/object/Tree_5.glb';
                    case 43:
                        return '/models/object/Tree_6.glb';
                    case 44:
                        return '/models/object/Tree_7.glb';
                    case 45:
                        return '/models/object/Tree_9.glb';
                    case 46:
                        return '/models/object/Tree_house_trunk.glb';
                    case 47:
                        return '/models/object/Tree_trunk.glb';
                    case 48:
                        return '/models/object/Wooden_box.glb';
                    default:
                        return '/models/object/Tree_1.glb';
                }
            }
            return '/models/object/Closet.glb';
        })(),
        true
    ) as GLTFResult;
    const getScaleByModelIndex = (modelIndex: number | undefined) => {
        if (roomState.roomMap === 'richRoom') {
            if (modelIndex === undefined) {
                return 0.025;
            } else return 0.025;
        } else if (roomState.roomMap === 'farm') {
            switch (modelIndex) {
                case 23:
                case 46:
                    return 3;
            }
            return 1;
        }
        return 1;
    };
    const { scene: defaultScene } = useGLTF('/models/object/Barrel.glb');
    const scale = getScaleByModelIndex(modelIndex);

    //개별 모델링을 통하여 다른 객체임을 알려줘야한다.
    // const scene = useMemo(() => {
    //     return scene_ ? SkeletonUtils.clone(scene_) : defaultScene;
    // }, [scene_, modelIndex]);
    const objectMap = useGraph(scene);
    const nodes = objectMap.nodes;
    const material = returnMaterial(modelIndex);
    const node = returnNode(modelIndex);

    // console.log(
    //     'scale : ',
    //     scale,
    //     ' scene : ',
    //     scene.children,
    //     ' modelIndex : ',
    //     modelIndex
    // );

    // const [ref] = useBox(() => ({
    //     mass: 0,
    //     args: [1, 1, 1],
    //     position: [position.x, position.y, position.z], // 초기 위치를 useRef의 현재 값으로 설정
    //     onCollide: (e) => {
    //         console.log('충돌', e);
    //     },
    // }));

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

        if (observerRef.current) {
            observerRef.current.viewUpDown -= rotationAmount * 0.05; // 이 부분 수정
        }
    };

    const updateRotationY = (movementX: number) => {
        //좌 우
        const rotationAmount = movementX * 0.0013; // 회전 속도 조절을 위해 상수를 곱합니다.
        if (playerRef.current) {
            // playerRef.current.rotation.y -= rotationAmount;
            playerRef.current.viewLR -= rotationAmount;
        }

        if (observerRef.current) {
            observerRef.current.viewLR -= rotationAmount;
        }
    };

    const handleMouseWheel = (event: WheelEvent) => {
        // 마우스 휠을 아래로 내릴 때
        if (event.deltaY > 0) {
            setMouseWheelValue((prevValue) => Math.min(12, prevValue + 1)); // 최댓값인 12를 넘지 않도록 설정
        }
        // 마우스 휠을 위로 올릴 때
        else if (event.deltaY < 0) {
            setMouseWheelValue((prevValue) => Math.max(1, prevValue - 1)); // 최솟값인 1보다 작아지지 않도록 설정
        }
    };

    const lockPointer = () => {
        const element = document.body;
        const requestPointerLock = element.requestPointerLock;
        requestPointerLock.call(element);
    };

    const toggleFreeViewMode = () => {
        if (playerRef.current) {
            stompClient.sendMessage(
                `/player.fix`,
                JSON.stringify({
                    type: 'player.fix',
                    roomId: roomId,
                    sender: meName,
                    data: {
                        nickname: meName,
                        selectedIndex: modelIndex,
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
        }

        setFreeViewMode((prevMode) => !prevMode);
        store.dispatch(observserModeState(freeViewMode));
    };

    const handlePageUp = () => {
        // 플레이어
        setObservedPlayerIndex((prevIndex) => {
            // 관전 중인 플레이어의 인덱스를 증가시킵니다.
            return (prevIndex + 1) % (roomState.roomPlayers.length + 1);
        });
    };

    const handlePageDown = () => {
        setObservedPlayerIndex((prevIndex) => {
            // 관전 중인 플레이어의 인덱스를 감소시킵니다.
            return (
                (prevIndex - 1 + roomState.roomPlayers.length + 1) %
                (roomState.roomPlayers.length + 1)
            );
        });
    };

    useEffect(() => {
        callsInLastSecondRef.current = callsInLastSecond;
    }, [callsInLastSecond]);

    // useEffect(() => {
    //     if(meInfo.isDead) {
    //         store.dispatch(observserModeState(true))
    //         console.log("사망!!!!! @@@ :" + isObserver);
    //     }
    // },[meInfo.isDead])

    useEffect(() => {
        // 3초마다 호출
        if (meInfo?.nickname === playerNickname) {
            const intervalId = setInterval(() => {
                console.log('송신 프레임 :', callsInLastSecondRef.current / 3);
                setCallsInLastSecond(0); // 85 ~ 95
                if (callsInLastSecondRef.current > 150) {
                    setDelay((preDelay) => preDelay + 0.00007);
                } else if (callsInLastSecondRef.current > 95) {
                    setDelay((preDelay) => preDelay + 0.00001);
                    // console.log('딜레이 값을 올리겠습니다.');
                } else if (callsInLastSecondRef.current < 85) {
                    setDelay((preDelay) => preDelay - 0.00001);
                    // console.log('딜레이 값을 낮추겠습니다.');
                }
            }, 3000);

            return () => clearInterval(intervalId);
        }
    }, []);

    useEffect(() => {
        if (meInfo.nickname !== playerNickname) return;
        const handleMouseMove = (event: MouseEvent) => {
            // 마우스 포인터가 고정된 상태에서의 마우스 이동량을 감지합니다.
            if (meInfo?.nickname === playerNickname) {
                const movementX = event.movementX || 0;
                const movementY = event.movementY || 0;
                updateRotationY(movementX);
                updateRotationX(movementY);
            }

            if (meInfo?.isDead === true) {
                const movementX = event.movementX || 0;
                const movementY = event.movementY || 0;
                updateRotationY(movementX);
                updateRotationX(movementY);
            }
        };

        // setMouseWheelValue(10);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('wheel', handleMouseWheel);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('wheel', handleMouseWheel);
        };
    }, [meInfo, meInfo.isDead]);

    useEffect(() => {
        if (playerRef.current) {
            // if (ref.current) {
            //     ref.current.name = playerNickname;
            // }
            playerRef.current.name = playerNickname;
            playerRef.current.userData.physicsName = playerNickname; // userData에 이름 추가
            playerRef.current.viewLR = 0;
        }
        // if (ref.current) {
        //     // Mesh 객체를 찾아 이름을 할당합니다.
        //     const mesh = ref.current.children.find(
        //         (child) => child.type === 'Mesh'
        //     );
        //     if (mesh) {
        //         mesh.name = playerNickname;
        //     }
        // }
        if (!observerRef.current) {
            observerRef.current = new Observer();
            observerRef.current.position = new Vector3(-70, 30, -20);
            observerRef.current.viewLR = 0;
            observerRef.current.viewUpDown = 0;
        }
    }, [playerNickname]);

    // 키 입력
    useEffect(() => {
        if (meInfo.nickname !== playerNickname) return;
        const handleKeyDown = (event: any) => {
            if (!chatFlag) {
                keyState.current[event.key] = true;
                if (
                    event.key === 'r' ||
                    event.key === 'R' ||
                    event.key === 'ㄱ'
                ) {
                    toggleFreeViewMode();
                }
            }
        };
        const handleKeyUp = (event: any) => {
            if (!chatFlag) {
                keyState.current[event.key] = false;
                if (event.key === 'ArrowRight') {
                    handlePageUp();
                } else if (event.key === 'ArrowLeft') {
                    handlePageDown();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [observedPlayerIndex, freeViewMode, chatFlag]);

    // 키 입력
    // useEffect(() => {
    //     const handleKeyDown = (event: any) => {
    //         if (!chatFlag) {
    //             keyState.current[event.key] = true;
    //         }
    //     };

    //     const handleKeyUp = (event: any) => {
    //         if (!chatFlag) {
    //             keyState.current[event.key] = false;
    //         }
    //     };

    //     document.addEventListener('keydown', handleKeyDown);
    //     document.addEventListener('keyup', handleKeyUp);
    //     return () => {
    //         document.removeEventListener('keydown', handleKeyDown);
    //         document.removeEventListener('keyup', handleKeyUp);
    //     };
    // }, [chatFlag]);

    useEffect(() => {
        if (meInfo.nickname !== playerNickname) return;
        const handleJumpDown = (event: any) => {
            if (event.code === 'Space' && !jumpFlag && !chatFlag) {
                setIsJumping(1);
                setJumpFlag(true);
            }
        };
        if (isJumping === 1 && jumpFlag) {
            // console.log('점프중입니다.');
            setTimeout(() => {
                // console.log('점프 내려가는 중입니다.');
                setIsJumping(2);
            }, 600); // Return after half a second
            setTimeout(() => {
                // console.log('점프 끝입니다.');
                setIsJumping(0);
                setJumpFlag(false);
            }, 1200);
        }
        document.addEventListener('keydown', handleJumpDown);
        return () => {
            document.removeEventListener('keydown', handleJumpDown);
        };
    }, [isJumping, chatFlag]);

    useFrame(({ camera, clock }) => {
        if (!player || !playerRef.current) return;
        if (!observerRef.current) return;
        if (
            (roomState.roomState == 1 || roomState.roomState == 2) &&
            meInfo.isSeeker === true
        ) {
            playerRef.current.position.set(-100, -100, -100);
            return;
        }

        if (meInfo?.nickname === playerNickname) {
            lockPointer();
            const delta = clock.getDelta(); // 프레임 간 시간 간격을 가져옵니다.
            accumulatedTimeRef.current += delta;

            if (meInfo?.isDead === false) {
                // 살아있는 경우
                if (!freeViewMode) {
                    // 3인칭 모드
                    const moveVector = new Vector3(
                        (keyState.current['d'] ||
                        keyState.current['D'] ||
                        keyState.current['ㅇ']
                            ? 1
                            : 0) -
                            (keyState.current['a'] ||
                            keyState.current['A'] ||
                            keyState.current['ㅁ']
                                ? 1
                                : 0), // 수정: 오른쪽이면 1, 왼쪽이면 -1
                        0,
                        (keyState.current['w'] ||
                        keyState.current['W'] ||
                        keyState.current['ㅈ']
                            ? 1
                            : 0) -
                            (keyState.current['s'] ||
                            keyState.current['S'] ||
                            keyState.current['ㄴ']
                                ? 1
                                : 0) // 수정: 위쪽이면 1, 아래쪽이면 -1
                    );

                    if (
                        keyState.current['q'] ||
                        keyState.current['Q'] ||
                        keyState.current['ㅂ']
                    ) {
                        playerRef.current.rotation.y += 0.025;
                    }

                    if (
                        keyState.current['e'] ||
                        keyState.current['E'] ||
                        keyState.current['ㄷ']
                    ) {
                        playerRef.current.rotation.y -= 0.025;
                    }

                    if (
                        !moveVector.equals(new Vector3(0, 0, 0)) ||
                        isJumping >= 0
                    ) {
                        // 이동중
                        // lockPointer();
                        moveVector.normalize().multiplyScalar(0.17);

                        const forward = new Vector3(
                            Math.sin(playerRef.current.viewLR), // viewLR 값으로 삼각함수를 통해 x 값을 설정
                            0,
                            Math.cos(playerRef.current.viewLR) // viewLR 값으로 삼각함수를 통해 z 값을 설정
                        ).normalize(); // 벡터를 정규화하여 길이를 1로 만듭니다.

                        const moveDirection = forward
                            .clone()
                            .multiplyScalar(moveVector.z)
                            .add(
                                new Vector3(
                                    -forward.z,
                                    0,
                                    forward.x
                                ).multiplyScalar(moveVector.x)
                            );

                        if (isJumping === 1) {
                            moveDirection.y = 0.08;
                        } else {
                            moveDirection.y = -0.08;
                        }
                        if (collideState.length > 0) {
                            const originPos =
                                playerRef.current.position.clone();
                            const newPos = originPos.clone().add(moveDirection);
                            collideState.map(
                                (item: CollideObject, index: number) => {
                                    const centerX = (item.minX + item.maxX) / 2;
                                    const centerY = (item.minY + item.maxY) / 2;
                                    const centerZ = (item.minZ + item.maxZ) / 2;

                                    if (
                                        originPos.x >= item.minX - 1 &&
                                        originPos.x <= item.maxX + 1 &&
                                        originPos.y >= item.minY - 1 &&
                                        originPos.y <= item.maxY + 1 &&
                                        originPos.z >= item.minZ - 1 &&
                                        originPos.z <= item.maxZ + 1
                                    ) {
                                        originPos.y += 0.1;
                                        newPos.y += 0.1;
                                        // console.log('충돌 범위', item);
                                        // console.log(originPos, newPos);
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
                                            if (
                                                playerRef.current.position.y <=
                                                initialHeight
                                            ) {
                                                playerRef.current.position.y =
                                                    initialHeight;
                                            }
                                            playerRef.current.position.add(
                                                moveDirection
                                            );
                                        }
                                    } else {
                                        store.dispatch(
                                            removeCollideObjectState(index)
                                        );
                                    }
                                }
                            );
                        } else {
                            if (playerRef.current.position.y <= initialHeight) {
                                playerRef.current.position.y = initialHeight;
                            }
                            playerRef.current.position.add(moveDirection);
                        }
                        if (
                            playerRef.current.position.x > mapState.maxX ||
                            playerRef.current.position.x < mapState.minX ||
                            playerRef.current.position.z > mapState.maxZ ||
                            playerRef.current.position.z < mapState.minZ ||
                            playerRef.current.position.y > mapState.maxY ||
                            playerRef.current.position.y < mapState.minY
                        ) {
                            console.log('원점으로 돌아갑니다');
                            playerRef.current.position.set(0, initialHeight, 0);
                        }
                        if (accumulatedTimeRef.current >= delay) {
                            // stomp로 이전
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
                                            Math.sin(
                                                playerRef.current.rotation.y
                                            ),
                                            0,
                                            Math.cos(
                                                playerRef.current.rotation.y
                                            ),
                                        ],
                                    },
                                })
                            );
                            setCallsInLastSecond((prevCount) => prevCount + 1);
                        }
                    } else {
                        // 고정된 상태
                        // rotation값 stomp
                        if (accumulatedTimeRef.current >= delay) {
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
                                            Math.sin(
                                                playerRef.current.rotation.y
                                            ),
                                            0,
                                            Math.cos(
                                                playerRef.current.rotation.y
                                            ),
                                        ],
                                    },
                                })
                            );
                            setCallsInLastSecond((prevCount) => prevCount + 1);
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
                    playerDirection.multiplyScalar(mouseWheelValue * 2);

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
                    // (R클릭)
                    if (observedPlayerIndex === roomState.roomPlayers.length) {
                        store.dispatch(observerState('자유시점'));
                        // 자유시점 모드
                        if (!observerRef.current) {
                            observerRef.current = new Observer();
                            observerRef.current.position = new Vector3(
                                playerRef.current.position.x + 12,
                                playerRef.current.position.y + 12,
                                playerRef.current.position.z + 12
                            );
                            observerRef.current.viewLR =
                                playerRef.current.viewLR;
                            observerRef.current.viewUpDown =
                                playerRef.current.viewUpDown;
                        }

                        const moveVector = new Vector3(
                            (keyState.current['d'] ||
                            keyState.current['D'] ||
                            keyState.current['ㅇ']
                                ? 1
                                : 0) -
                                (keyState.current['a'] ||
                                keyState.current['A'] ||
                                keyState.current['ㅁ']
                                    ? 1
                                    : 0),
                            0,
                            (keyState.current['w'] ||
                            keyState.current['W'] ||
                            keyState.current['ㅈ']
                                ? 1
                                : 0) -
                                (keyState.current['s'] ||
                                keyState.current['S'] ||
                                keyState.current['ㄴ']
                                    ? 1
                                    : 0)
                        );

                        if (!moveVector.equals(new Vector3(0, 0, 0))) {
                            // lockPointer();
                            moveVector.normalize().multiplyScalar(0.35); // 속도조절

                            const forward = new Vector3(
                                Math.sin(observerRef.current.viewLR), // viewLR 값으로 삼각함수를 통해 x 값을 설정
                                Math.sin(observerRef.current.viewUpDown),
                                Math.cos(observerRef.current.viewLR) // viewLR 값으로 삼각함수를 통해 z 값을 설정
                            ).normalize(); // 벡터를 정규화하여 길이를 1로 만듭니다.

                            const moveDirection = forward
                                .clone()
                                .multiplyScalar(moveVector.z)
                                .add(
                                    new Vector3(
                                        -forward.z,
                                        0,
                                        forward.x
                                    ).multiplyScalar(moveVector.x)
                                );

                            observerRef.current.position.add(moveDirection);
                        }

                        // 프리뷰 카메라 설정
                        const observerDirection = new Vector3( // 플레이어가 바라보는 곳
                            Math.sin(observerRef.current.viewLR),
                            observerRef.current.viewUpDown, // 아래 위
                            Math.cos(observerRef.current.viewLR)
                        );
                        const cameraTarget = observerRef.current.position
                            .clone()
                            .add(observerDirection.multiplyScalar(3));

                        camera.position.set(
                            observerRef.current.position.x,
                            observerRef.current.position.y,
                            observerRef.current.position.z
                        );
                        camera.lookAt(cameraTarget);
                    } else {
                        // 관전모드
                        // lockPointer();
                        if (!observerRef.current) {
                            observerRef.current = new Observer();
                            observerRef.current.position = new Vector3(0, 0, 0);
                            observerRef.current.viewLR =
                                playerRef.current.viewLR;
                            observerRef.current.viewUpDown =
                                playerRef.current.viewUpDown;
                        }
                        // if(meInfo.isSeeker === true) return;
                        const observedPlayer =
                            roomState.roomPlayers[observedPlayerIndex];

                        store.dispatch(
                            observerState(
                                '관전 중 : ' + observedPlayer.nickname
                            )
                        );
                        if (observedPlayer) {
                            camera.position.set(
                                //
                                observedPlayer.position[0] +
                                    Math.sin(observerRef.current.viewLR) * 20,
                                observedPlayer.position[1] + 10,
                                observedPlayer.position[2] +
                                    Math.cos(observerRef.current.viewLR) * 20
                            );
                            camera.lookAt(
                                observedPlayer.position[0],
                                observedPlayer.position[1],
                                observedPlayer.position[2]
                            );
                        }
                    }
                }
            }
            // 사망 시
            if (
                meInfo.isDead &&
                !meInfo.isSeeker &&
                meInfo.nickname === playerNickname
            ) {
                console.log('!!사망상태 : ' + observedPlayerIndex);
                if (observedPlayerIndex === roomState.roomPlayers.length) {
                    // 자유시점 모드w
                    store.dispatch(observerState('자유시점'));
                    const moveVector = new Vector3(
                        (keyState.current['d'] ||
                        keyState.current['D'] ||
                        keyState.current['ㅇ']
                            ? 1
                            : 0) -
                            (keyState.current['a'] ||
                            keyState.current['A'] ||
                            keyState.current['ㅁ']
                                ? 1
                                : 0),
                        0,
                        (keyState.current['w'] ||
                        keyState.current['W'] ||
                        keyState.current['ㅈ']
                            ? 1
                            : 0) -
                            (keyState.current['s'] ||
                            keyState.current['S'] ||
                            keyState.current['ㄴ']
                                ? 1
                                : 0)
                    );

                    if (!moveVector.equals(new Vector3(0, 0, 0))) {
                        // lockPointer();
                        moveVector.normalize().multiplyScalar(0.2); // 속도조절

                        const forward = new Vector3(
                            Math.sin(observerRef.current.viewLR), // viewLR 값으로 삼각함수를 통해 x 값을 설정
                            Math.sin(observerRef.current.viewUpDown),
                            Math.cos(observerRef.current.viewLR) // viewLR 값으로 삼각함수를 통해 z 값을 설정
                        ).normalize(); // 벡터를 정규화하여 길이를 1로 만듭니다.

                        const moveDirection = forward
                            .clone()
                            .multiplyScalar(moveVector.z)
                            .add(
                                new Vector3(
                                    -forward.z,
                                    0,
                                    forward.x
                                ).multiplyScalar(moveVector.x)
                            );

                        observerRef.current.position.add(moveDirection);
                    }

                    // 프리뷰 카메라 설정
                    const observerDirection = new Vector3( // 플레이어가 바라보는 곳
                        Math.sin(observerRef.current.viewLR),
                        observerRef.current.viewUpDown, // 아래 위
                        Math.cos(observerRef.current.viewLR)
                    );
                    const cameraTarget = observerRef.current.position
                        .clone()
                        .add(observerDirection.multiplyScalar(3));

                    camera.position.set(
                        observerRef.current.position.x,
                        observerRef.current.position.y,
                        observerRef.current.position.z
                    );
                    camera.lookAt(cameraTarget);
                } else {
                    // 관전모드
                    // lockPointer();
                    const observedPlayer =
                        roomState.roomPlayers[observedPlayerIndex];

                    store.dispatch(
                        observerState('관전 중 : ' + observedPlayer.nickname)
                    );
                    if (observedPlayer) {
                        camera.position.set(
                            //ㅈ
                            observedPlayer.position[0] +
                                Math.sin(observerRef.current.viewLR) * 20,
                            observedPlayer.position[1] + 10,
                            observedPlayer.position[2] +
                                Math.cos(observerRef.current.viewLR) * 20
                        );
                        camera.lookAt(
                            observedPlayer.position[0],
                            observedPlayer.position[1],
                            observedPlayer.position[2]
                        );
                    }
                }
            }
        } else {
            // 다른 플레이어의 캐릭터
            roomState.roomPlayers.forEach((otherPlayer: any) => {
                if (
                    otherPlayer.nickname === playerNickname &&
                    otherPlayer.isSeeker === false
                ) {
                    if (
                        meInfo.isSeeker === true &&
                        (roomState.roomState == 1 || roomState.roomState == 2)
                    )
                        return; // 준비시간동안 술래는 사물을 볼 수 없다
                    const otherPlayerRef = playerRef.current;
                    if (otherPlayerRef) {
                        // 위치 적용
                        otherPlayerRef?.position.set(
                            otherPlayer.position[0],
                            otherPlayer.position[1],
                            otherPlayer.position[2]
                        );

                        // 방향 적용
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
                    }
                }
            });
        }

        // if (meInfo.isDead && !meInfo.isSeeker && meInfo.nickname === playerNickname) {
        //     console.log("!!사망상태 : " + observedPlayerIndex);
        //     if (observedPlayerIndex === roomState.roomPlayers.length) {
        //         // 자유시점 모드w
        //         store.dispatch(observerState('자유시점'));
        //         const moveVector = new Vector3(
        //             (keyState.current['d'] ||
        //             keyState.current['D'] ||
        //             keyState.current['ㅇ']
        //                 ? 1
        //                 : 0) -
        //                 (keyState.current['a'] ||
        //                 keyState.current['A'] ||
        //                 keyState.current['ㅁ']
        //                     ? 1
        //                     : 0),
        //             0,
        //             (keyState.current['w'] ||
        //             keyState.current['W'] ||
        //             keyState.current['ㅈ']
        //                 ? 1
        //                 : 0) -
        //                 (keyState.current['s'] ||
        //                 keyState.current['S'] ||
        //                 keyState.current['ㄴ']
        //                     ? 1
        //                     : 0)
        //         );

        //         if (!moveVector.equals(new Vector3(0, 0, 0))) {
        //             // lockPointer();
        //             moveVector.normalize().multiplyScalar(0.35); // 속도조절

        //             const forward = new Vector3(
        //                 Math.sin(observerRef.current.viewLR), // viewLR 값으로 삼각함수를 통해 x 값을 설정
        //                 Math.sin(observerRef.current.viewUpDown),
        //                 Math.cos(observerRef.current.viewLR) // viewLR 값으로 삼각함수를 통해 z 값을 설정
        //             ).normalize(); // 벡터를 정규화하여 길이를 1로 만듭니다.

        //             const moveDirection = forward
        //                 .clone()
        //                 .multiplyScalar(moveVector.z)
        //                 .add(
        //                     new Vector3(
        //                         -forward.z,
        //                         0,
        //                         forward.x
        //                     ).multiplyScalar(moveVector.x)
        //                 );

        //             observerRef.current.position.add(moveDirection);
        //         }

        //         // 프리뷰 카메라 설정
        //         const observerDirection = new Vector3( // 플레이어가 바라보는 곳
        //             Math.sin(observerRef.current.viewLR),
        //             observerRef.current.viewUpDown, // 아래 위
        //             Math.cos(observerRef.current.viewLR)
        //         );
        //         const cameraTarget = observerRef.current.position
        //             .clone()
        //             .add(observerDirection.multiplyScalar(3));

        //         camera.position.set(
        //             observerRef.current.position.x,
        //             observerRef.current.position.y,
        //             observerRef.current.position.z
        //         );
        //         camera.lookAt(cameraTarget);
        //     } else {
        //         // 관전모드
        //         // lockPointer();
        //         const observedPlayer =
        //             roomState.roomPlayers[observedPlayerIndex];

        //         store.dispatch(
        //             observerState('관전 중 : ' + observedPlayer.nickname)
        //         );
        //         if (observedPlayer) {
        //             camera.position.set(
        //                 //
        //                 observedPlayer.position[0] +
        //                     Math.sin(observerRef.current.viewLR) * 20,
        //                 observedPlayer.position[1] + 10,
        //                 observedPlayer.position[2] +
        //                     Math.cos(observerRef.current.viewLR) * 20
        //             );
        //             camera.lookAt(
        //                 observedPlayer.position[0],
        //                 observedPlayer.position[1],
        //                 observedPlayer.position[2]
        //             );
        //         }
        //     }
        // }

        // if(meInfo.nickname === playerNickname) {
        //     store.dispatch(cameraPositionState(camera.position.clone()))
        // }
        if (meInfo.isSeeker === false) {
            // 사물만 사물의 이름을 식별할 수 있다
            if (nicknameRef.current) {
                nicknameRef.current.position.set(
                    playerRef.current.position.x,
                    playerRef.current.position.y + 3,
                    playerRef.current.position.z
                );
                // nicknameRef.current.lookAt(myCameraPosition);
                nicknameRef.current.lookAt(camera.position);
            }
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
        initialHeight,
    };

    function returnMaterial(num: number | undefined) {
        if (roomState.roomMap === 'richRoom') {
            if (num === undefined || num < 19) {
                return [materials['Cartoon_Room_Mat.002']];
            } else {
                return [materials.Cartoon_Room_Mat];
            }
        } else if (roomState.roomMap === 'farm') {
            switch (num) {
                case 0:
                    return [materials.Brown_4, materials.Gray];
                case 1:
                    return [materials.Brown_4, materials.Gray];
                case 2:
                    return [
                        materials.Dark_Gray,
                        materials.Light_Gray,
                        materials.material,
                    ];
                case 3:
                    return [materials.Brown_4, materials.Gray];
                case 4:
                    return [materials.Brown_3, materials.Gray];

                case 5:
                    return [materials.Brown_4, materials.Brown];
                case 6:
                    return [materials.Brown_4, materials.Brown];
                case 7:
                    return [
                        materials.Forest_Green,
                        materials.Gold,
                        materials.material,
                    ];
                case 8:
                    return [
                        materials.Forest_Green,
                        materials.Grass_Green,
                        materials.material,
                        materials.Yellow,
                    ];
                case 9:
                    return [materials.Forest_Green, materials.Grass_Green];
                case 10:
                    return [materials.Forest_Green, materials.Grass_Green];
                case 11:
                    return [
                        materials.Grass_Green,
                        materials.Pink,
                        materials.Yellow,
                    ];
                case 12:
                    return [materials.Grass_Green, materials.Pink];
                case 13:
                    return [materials.Forest_Green, materials.Grass_Green];
                case 14:
                    return [materials.Grass_Green, materials.Orange];
                case 15:
                    return [materials.Brown_2, materials.Dark_Gray];
                case 16:
                    return [
                        materials.Brown_2,
                        materials.Brown_3,
                        materials.Brown_4,
                        materials.Gray_Blue,
                        materials.Yellow_2,
                    ];
                case 17:
                    return [materials.Dark_Gray, materials.Forest_Green];
                case 18:
                    return [materials.Light_Gray];
                case 19:
                    return [materials.Brown_4, materials.Gray];
                case 20:
                    return [materials.Grass_Green];
                case 21:
                    return [
                        materials.Brown_2,
                        materials.Gray_Blue,
                        materials.Light_Gray,
                    ];
                case 22:
                    return [
                        materials.Brown_2,
                        materials.Gray_Blue,
                        materials.Light_Gray,
                    ];
                case 23:
                    return [materials.Brown_2, materials.Yellow];
                case 24:
                    return [
                        materials.Blue,
                        materials.Brown_2,
                        materials.Brown_3,
                        materials.Brown_4,
                        materials.Brown,
                        materials.Gray_Blue,
                        materials.Gray,
                    ];
                case 25:
                    return [
                        materials.Black,
                        materials.Brown,
                        materials.Dark_Blue,
                        materials.Gray_Blue,
                        materials.Gray,
                        materials.Light_Gray,
                        materials.Purple_2,
                        materials.Purple_3,
                        materials.Purple_4,
                    ];
                case 26:
                    return [
                        materials.Blue_2,
                        materials.Brown_2,
                        materials.Brown_3,
                        materials.Gray,
                        materials.Light_Gray,
                        materials.material,
                        materials.Yellow_2,
                    ];
                case 27:
                    return [
                        materials.Blue_2,
                        materials.Brown_2,
                        materials.Gray_Blue,
                        materials.material,
                        materials.Yellow_2,
                    ];
                case 28:
                    return [
                        materials.Black,
                        materials.Blue_2,
                        materials.Brown_2,
                        materials.Brown_3,
                        materials.Gray_Blue,
                        materials.Gray,
                        materials.material,
                        materials.Yellow_2,
                    ];
                case 29:
                    return [
                        materials.Blue,
                        materials.Brown_2,
                        materials.Brown_3,
                        materials.Brown_4,
                        materials.Gray,
                        materials.Light_Gray,
                    ];
                case 30:
                    return [
                        materials.Blue,
                        materials.Brown_2,
                        materials.Brown_3,
                        materials.Brown_4,
                        materials.Gray_Blue,
                        materials.Gray,
                        materials.Light_Gray,
                        materials.material,
                        materials.Yellow_2,
                    ];
                case 31:
                    return [
                        materials.Gray,
                        materials.Light_Gray,
                        materials.Yellow,
                    ];
                case 32:
                    return [
                        materials.Gray,
                        materials.Light_Gray,
                        materials.Yellow,
                    ];
                case 33:
                    return [materials.Brown_3, materials.Brown_4];
                case 34:
                    return [materials.Forest_Green, materials.Yellow_2];
                case 35:
                    return [materials.Dark_Gray];
                case 36:
                    return [
                        materials.Brown_4,
                        materials.Gray,
                        materials.Light_Gray,
                    ];
                case 37:
                    return [
                        materials.Dark_Gray,
                        materials.Gray_Blue,
                        materials.Green,
                        materials.material,
                        materials.Yellow,
                    ];
                case 38:
                    return [
                        materials.Dark_Gray,
                        materials.Gray_Blue,
                        materials.Green,
                        materials.material,
                        materials.Yellow,
                    ];
                case 39:
                    return [
                        materials.Brown_2,
                        materials.Brown_4,
                        materials.Dark_Gray,
                        materials.Forest_Green,
                        materials.Yellow_2,
                    ];
                case 40:
                    return [
                        materials.Brown_2,
                        materials.Forest_Green,
                        materials.material,
                    ];
                case 41:
                    return [materials.Brown_2, materials.Grass_Green];
                case 42:
                    return [
                        materials.Brown_2,
                        materials.Dark_Gray,
                        materials.Forest_Green,
                    ];
                case 43:
                    return [materials.Brown_2, materials.Forest_Green];
                case 44:
                    return [
                        materials.Brown_2,
                        materials.Brown,
                        materials.Dark_Gray,
                        materials.Forest_Green,
                    ];
                case 45:
                    return [materials.Brown, materials.Gold, materials.Orange];
                case 46:
                    return [
                        materials.Brown_2,
                        materials.Brown_3,
                        materials.Brown_4,
                        materials.Brown,
                    ];
                case 47:
                    return [materials.Brown_3, materials.Brown_4];
                case 48:
                    return [materials.Brown_4, materials.Gray];
                default:
                    return [materials.Brown_4, materials.Gray];
            }
        }
        return [materials['Cartoon_Room_Mat.002']];
    }
    function returnNode(num: number | undefined) {
        if (roomState.roomMap === 'richRoom') {
            switch (num) {
                case 0:
                    return [(nodes.Barrel_1 as SkinnedMesh).geometry];
                case 1:
                    return [(nodes.Barrel_1 as SkinnedMesh).geometry];
                case 2:
                    return [(nodes.Chair_11 as SkinnedMesh).geometry];
                case 3:
                    return [(nodes.Chair_4 as SkinnedMesh).geometry];
                case 4:
                    return [(nodes.Toy_Pig_1 as SkinnedMesh).geometry];
                case 5:
                    return [(nodes.Kitchen_Cabinet_4 as SkinnedMesh).geometry];
                case 6:
                    return [(nodes.Washstand_2 as SkinnedMesh).geometry];
                case 7:
                    return [(nodes.Kitchen_Cabinet_5 as SkinnedMesh).geometry];
                case 8:
                    return [(nodes.Kitchen_Cabinet_5 as SkinnedMesh).geometry];
                case 9:
                    return [(nodes.Kitchen_Cabinet_6 as SkinnedMesh).geometry];
                case 10:
                    return [(nodes.Ladder_1 as SkinnedMesh).geometry];
                case 11:
                    return [(nodes.Shelf_4 as SkinnedMesh).geometry];
                case 12:
                    return [(nodes.Table_5 as SkinnedMesh).geometry];
                case 13:
                    return [(nodes.Ham_1 as SkinnedMesh).geometry];
                case 14:
                    return [(nodes.Ham_2 as SkinnedMesh).geometry];
                case 15:
                    return [(nodes.Pot_2 as SkinnedMesh).geometry];
                case 16:
                    return [(nodes.Pot_1 as SkinnedMesh).geometry];
                case 17:
                    return [(nodes.Fridge_2 as SkinnedMesh).geometry];
                case 18:
                    return [(nodes.Table_13 as SkinnedMesh).geometry];
                case 19:
                    return [(nodes.Armchair_1 as SkinnedMesh).geometry];
                case 20:
                    return [(nodes.Armchair_2 as SkinnedMesh).geometry];
                case 21:
                    return [(nodes.Basket_2 as SkinnedMesh).geometry];
                case 22:
                    return [(nodes.Bath_1 as SkinnedMesh).geometry];
                case 23:
                    return [(nodes.Bed_2 as SkinnedMesh).geometry];
                case 24:
                    return [(nodes.Bed_6 as SkinnedMesh).geometry];
                case 25:
                    return [(nodes.Bed_3 as SkinnedMesh).geometry];
                case 26:
                    return [(nodes.Books_6 as SkinnedMesh).geometry];
                case 27:
                    return [(nodes.Books_8 as SkinnedMesh).geometry];
                case 28:
                    return [(nodes.Books_4 as SkinnedMesh).geometry];
                case 29:
                    return [(nodes.Books_2 as SkinnedMesh).geometry];
                case 30:
                    return [(nodes.Books_15 as SkinnedMesh).geometry];
                case 31:
                    return [(nodes.Bottle_20 as SkinnedMesh).geometry];
                case 32:
                    return [(nodes.Bottle_22 as SkinnedMesh).geometry];
                case 33:
                    return [(nodes.Box_7 as SkinnedMesh).geometry];
                case 34:
                    return [(nodes.Bread_1 as SkinnedMesh).geometry];
                case 35:
                    return [(nodes.Cactus_5 as SkinnedMesh).geometry];
                case 36:
                    return [(nodes.Cactus_6 as SkinnedMesh).geometry];
                case 37:
                    return [(nodes.Cactus_4 as SkinnedMesh).geometry];
                case 38:
                    return [(nodes.Cake_1 as SkinnedMesh).geometry];
                case 39:
                    return [(nodes.Carpet_16 as SkinnedMesh).geometry];
                case 40:
                    return [(nodes.Carpet_8 as SkinnedMesh).geometry];
                case 41:
                    return [(nodes.Chair_5 as SkinnedMesh).geometry];
                case 42:
                    return [(nodes.Clock_1 as SkinnedMesh).geometry];
                case 43:
                    return [(nodes.Coffee_Drink_1 as SkinnedMesh).geometry];
                case 44:
                    return [(nodes.Cup_1 as SkinnedMesh).geometry];
                case 45:
                    return [(nodes.Cup_2 as SkinnedMesh).geometry];
                case 46:
                    return [(nodes.Toy_1 as SkinnedMesh).geometry];
                case 47:
                    return [(nodes.Chicken_Toy_1 as SkinnedMesh).geometry];
                case 48:
                    return [(nodes.Toy_Mushroom_1 as SkinnedMesh).geometry];
                case 49:
                    return [(nodes.Toy_Mushroom_2 as SkinnedMesh).geometry];
                case 50:
                    return [(nodes.Toy_Cat_1 as SkinnedMesh).geometry];
                case 51:
                    return [(nodes.Toy_Rabbit_1 as SkinnedMesh).geometry];
                case 52:
                    return [(nodes.Cabinet_19 as SkinnedMesh).geometry];
                case 53:
                    return [(nodes.Kitchen_Cabinet_3 as SkinnedMesh).geometry];
                case 54:
                    return [(nodes.Flower_5 as SkinnedMesh).geometry];
                case 55:
                    return [(nodes.Flower_2 as SkinnedMesh).geometry];
                case 56:
                    return [(nodes.Flower_1 as SkinnedMesh).geometry];
                case 57:
                    return [
                        (nodes.Vase_with_Flowers_1 as SkinnedMesh).geometry,
                    ];
                case 58:
                    return [
                        (nodes.Vase_with_Flowers_3 as SkinnedMesh).geometry,
                    ];
                case 59:
                    return [(nodes.Flower_6 as SkinnedMesh).geometry];
                case 60:
                    return [(nodes.Flower_7 as SkinnedMesh).geometry];
                case 61:
                    return [(nodes.Flower_8 as SkinnedMesh).geometry];
                case 62:
                    return [(nodes.Flower_9 as SkinnedMesh).geometry];
                case 63:
                    return [(nodes.Flower_10 as SkinnedMesh).geometry];
                case 64:
                    return [(nodes.Spatula_1 as SkinnedMesh).geometry];
                case 65:
                    return [(nodes.Painting_18 as SkinnedMesh).geometry];
                case 66:
                    return [(nodes.Painting_19 as SkinnedMesh).geometry];
                case 67:
                    return [(nodes.Painting_20 as SkinnedMesh).geometry];
                case 68:
                    return [
                        (nodes.Childrens_Drawing_3 as SkinnedMesh).geometry,
                    ];
                case 69:
                    return [
                        (nodes.Childrens_Drawing_1 as SkinnedMesh).geometry,
                    ];
                case 70:
                    return [
                        (nodes.Childrens_Drawing_2 as SkinnedMesh).geometry,
                    ];
                case 71:
                    return [(nodes.Flags_1 as SkinnedMesh).geometry];
                case 72:
                    return [(nodes.Mannequin_1 as SkinnedMesh).geometry];
                case 73:
                    return [(nodes.Mirror_1 as SkinnedMesh).geometry];
                case 74:
                    return [(nodes.Ottoman_1 as SkinnedMesh).geometry];
                case 75:
                    return [(nodes.Ottoman_2 as SkinnedMesh).geometry];
                case 76:
                    return [(nodes.Ottoman_3 as SkinnedMesh).geometry];
                case 77:
                    return [(nodes.Plate_1 as SkinnedMesh).geometry];
                case 78:
                    return [(nodes.Plate_3 as SkinnedMesh).geometry];
                case 79:
                    return [(nodes.Pot_Full_1 as SkinnedMesh).geometry];
                case 80:
                    return [(nodes.Present_1 as SkinnedMesh).geometry];
                case 81:
                    return [(nodes.Present_2 as SkinnedMesh).geometry];
                case 82:
                    return [(nodes.Present_3 as SkinnedMesh).geometry];
                case 83:
                    return [(nodes.Puzzle_1 as SkinnedMesh).geometry];
                case 84:
                    return [(nodes.Puzzle_2 as SkinnedMesh).geometry];
                case 85:
                    return [(nodes.Puzzle_3 as SkinnedMesh).geometry];
                case 86:
                    return [(nodes.Puzzle_4 as SkinnedMesh).geometry];
                case 87:
                    return [(nodes.Table_6 as SkinnedMesh).geometry];
                case 88:
                    return [(nodes.Sandwich_1 as SkinnedMesh).geometry];
                case 89:
                    return [(nodes.Sausages_1 as SkinnedMesh).geometry];
                case 90:
                    return [(nodes.Sewing_machine_1 as SkinnedMesh).geometry];
                case 91:
                    return [(nodes.Couch_5 as SkinnedMesh).geometry];
                case 92:
                    return [(nodes.Couch_1 as SkinnedMesh).geometry];
                case 93:
                    return [(nodes.Towels_1 as SkinnedMesh).geometry];
                case 94:
                    return [(nodes.Towels_2 as SkinnedMesh).geometry];
                case 95:
                    return [(nodes.TV_1 as SkinnedMesh).geometry];
                case 96:
                    return [(nodes.Plant_44 as SkinnedMesh).geometry];
                case 97:
                    return [(nodes.Plant_60 as SkinnedMesh).geometry];
                case 98:
                    return [(nodes.Plant_65 as SkinnedMesh).geometry];
                case 99:
                    return [(nodes.Tree_1 as SkinnedMesh).geometry];
                case 100:
                    return [(nodes.Plant_17 as SkinnedMesh).geometry];
                default:
                    return [(nodes.Cabinet_18 as SkinnedMesh).geometry];
            }
        } else if (roomState.roomMap === 'farm') {
            switch (num) {
                case 0:
                    return [
                        (nodes.Axe_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Axe_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 1:
                    return [
                        (nodes.Axe_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Axe_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 2:
                    return [
                        (nodes.Barn_Dark_Gray_0 as SkinnedMesh).geometry,
                        (nodes.Barn_Light_Gray_0 as SkinnedMesh).geometry,
                        (nodes.Barn_Red_0 as SkinnedMesh).geometry,
                    ];
                case 3:
                    return [
                        (nodes.Barrel_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Barrel_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 4:
                    return [
                        (nodes.Bench_2_Brown_3_0 as SkinnedMesh).geometry,
                        (nodes.Bench_2_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 5:
                    return [
                        (nodes.Bridge_1_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Bridge_1_Brown__0 as SkinnedMesh).geometry,
                    ];
                case 6:
                    return [
                        (nodes.Bridge_2_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Bridge_2_Brown__0 as SkinnedMesh).geometry,
                    ];
                case 7:
                    return [
                        (nodes.Bush001_Forest_Green_0 as SkinnedMesh).geometry,
                        (nodes.Bush001_Gold__0 as SkinnedMesh).geometry,
                        (nodes.Bush001_Red_0 as SkinnedMesh).geometry,
                    ];
                case 8:
                    return [
                        (nodes.Bush002_Forest_Green_0 as SkinnedMesh).geometry,
                        (nodes.Bush002_Grass_Green_0 as SkinnedMesh).geometry,
                        (nodes.Bush002_Red_0 as SkinnedMesh).geometry,
                        (nodes.Bush002_Yellow_0 as SkinnedMesh).geometry,
                    ];
                case 9:
                    return [
                        (nodes.Bush003_Forest_Green_0 as SkinnedMesh).geometry,
                        (nodes.Bush003_Grass_Green_0 as SkinnedMesh).geometry,
                    ];
                case 10:
                    return [
                        (nodes.Bush004_Forest_Green_0 as SkinnedMesh).geometry,
                        (nodes.Bush004_Grass_Green_0 as SkinnedMesh).geometry,
                    ];
                case 11:
                    return [
                        (nodes.Bush005_Grass_Green_0 as SkinnedMesh).geometry,
                        (nodes.Bush005_Pink_0 as SkinnedMesh).geometry,
                        (nodes.Bush005_Yellow_0 as SkinnedMesh).geometry,
                    ];
                case 12:
                    return [
                        (nodes.Bush006_Grass_Green_0 as SkinnedMesh).geometry,
                        (nodes.Bush006_Pink_0 as SkinnedMesh).geometry,
                    ];
                case 13:
                    return [
                        (nodes.Bush_Forest_Green_0 as SkinnedMesh).geometry,
                        (nodes.Bush_Grass_Green_0 as SkinnedMesh).geometry,
                    ];
                case 14:
                    return [
                        (nodes.Carrot_Grass_Green_0 as SkinnedMesh).geometry,
                        (nodes.Carrot_Orange_0 as SkinnedMesh).geometry,
                    ];
                case 15:
                    return [
                        (nodes.Chalk_Board_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Chalk_Board_Dark_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 16:
                    return [
                        (nodes.Chicken_coop_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Chicken_coop_Brown_3_0 as SkinnedMesh).geometry,
                        (nodes.Chicken_coop_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Chicken_coop_Gray_Blue_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Chicken_coop_Yellow_2_0 as SkinnedMesh).geometry,
                    ];
                case 17:
                    return [
                        (nodes.Dumpster_Dark_Gray_0 as SkinnedMesh).geometry,
                        (nodes.Dumpster_Forest_Green_0 as SkinnedMesh).geometry,
                    ];
                case 18:
                    return [(nodes.Fence_Light_Gray_0 as SkinnedMesh).geometry];
                case 19:
                    return [
                        (nodes.Fork_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Fork_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 20:
                    return [
                        (nodes.Grass_Grass_Green_0 as SkinnedMesh).geometry,
                    ];
                case 21:
                    return [
                        (nodes.Grave_1_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Grave_1_Gray_Blue_0 as SkinnedMesh).geometry,
                        (nodes.Grave_1_Light_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 22:
                    return [
                        (nodes.Grave_2_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Grave_2_Gray_Blue_0 as SkinnedMesh).geometry,
                        (nodes.Grave_2_Light_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 23:
                    return [
                        (nodes.Hay_bale_1_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Hay_bale_1_Yellow_0 as SkinnedMesh).geometry,
                    ];
                case 24:
                    return [
                        (nodes.House_1_Blue_0 as SkinnedMesh).geometry,
                        (nodes.House_1_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.House_1_Brown_3_0 as SkinnedMesh).geometry,
                        (nodes.House_1_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.House_1_Brown__0 as SkinnedMesh).geometry,
                        (nodes.House_1_Gray_Blue_0 as SkinnedMesh).geometry,
                        (nodes.House_1_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 25:
                    return [
                        (nodes.House_2_Black_0 as SkinnedMesh).geometry,
                        (nodes.House_2_Brown__0 as SkinnedMesh).geometry,
                        (nodes.House_2_Dark_Blue__0 as SkinnedMesh).geometry,
                        (nodes.House_2_Gray_Blue__0 as SkinnedMesh).geometry,
                        (nodes.House_2_Gray_0 as SkinnedMesh).geometry,
                        (nodes.House_2_Light_Gray_0 as SkinnedMesh).geometry,
                        (nodes.House_2_Purple_2_0 as SkinnedMesh).geometry,
                        (nodes.House_2_Purple_3_0 as SkinnedMesh).geometry,
                        (nodes.House_2_Purple_4_0 as SkinnedMesh).geometry,
                    ];
                case 26:
                    return [
                        (nodes.House_3_Blue_2_0 as SkinnedMesh).geometry,
                        (nodes.House_3_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.House_3_Brown_3_0 as SkinnedMesh).geometry,
                        (nodes.House_3_Gray_0 as SkinnedMesh).geometry,
                        (nodes.House_3_Light_Gray_0 as SkinnedMesh).geometry,
                        (nodes.House_3_Red_0 as SkinnedMesh).geometry,
                        (nodes.House_3_Yellow_2_0 as SkinnedMesh).geometry,
                    ];
                case 27:
                    return [
                        (nodes.House_4_Blue_2_0 as SkinnedMesh).geometry,
                        (nodes.House_4_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.House_4_Gray_Blue_0 as SkinnedMesh).geometry,
                        (nodes.House_4_Red_0 as SkinnedMesh).geometry,
                        (nodes.House_4_Yellow_2_0 as SkinnedMesh).geometry,
                    ];
                case 28:
                    return [
                        (nodes.House_5_Black_0 as SkinnedMesh).geometry,
                        (nodes.House_5_Blue_2_0 as SkinnedMesh).geometry,
                        (nodes.House_5_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.House_5_Brown_3_0 as SkinnedMesh).geometry,
                        (nodes.House_5_Gray_Blue_0 as SkinnedMesh).geometry,
                        (nodes.House_5_Gray_0 as SkinnedMesh).geometry,
                        (nodes.House_5_Red_0 as SkinnedMesh).geometry,
                        (nodes.House_5_Yellow_2_0 as SkinnedMesh).geometry,
                    ];
                case 29:
                    return [
                        (nodes.House_6_Blue_0 as SkinnedMesh).geometry,
                        (nodes.House_6_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.House_6_Brown_3_0 as SkinnedMesh).geometry,
                        (nodes.House_6_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.House_6_Gray_0 as SkinnedMesh).geometry,
                        (nodes.House_6_Light_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 30:
                    return [
                        (nodes.House_7_Blue_0 as SkinnedMesh).geometry,
                        (nodes.House_7_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.House_7_Brown_3_0 as SkinnedMesh).geometry,
                        (nodes.House_7_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.House_7_Gray_Blue_0 as SkinnedMesh).geometry,
                        (nodes.House_7_Gray_0 as SkinnedMesh).geometry,
                        (nodes.House_7_Light_Gray_0 as SkinnedMesh).geometry,
                        (nodes.House_7_Red_0 as SkinnedMesh).geometry,
                        (nodes.House_7_Yellow_2_0 as SkinnedMesh).geometry,
                    ];
                case 31:
                    return [
                        (nodes.Light_pole_1_Gray_0 as SkinnedMesh).geometry,
                        (nodes.Light_pole_1_Light_Gray_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Light_pole_1_Yellow_0 as SkinnedMesh).geometry,
                    ];
                case 32:
                    return [
                        (nodes.Light_pole_2_Gray_0 as SkinnedMesh).geometry,
                        (nodes.Light_pole_2_Light_Gray_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Light_pole_2_Yellow_0 as SkinnedMesh).geometry,
                    ];
                case 33:
                    return [
                        (nodes.Logs_Brown_3_0 as SkinnedMesh).geometry,
                        (nodes.Logs_Brown_4_0 as SkinnedMesh).geometry,
                    ];
                case 34:
                    return [
                        (nodes.Pumpkin_Forest_Green_0 as SkinnedMesh).geometry,
                        (nodes.Pumpkin_Yellow_2_0 as SkinnedMesh).geometry,
                    ];
                case 35:
                    return [(nodes.Rock_Dark_Gray_0 as SkinnedMesh).geometry];
                case 36:
                    return [
                        (nodes.Scythe_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Scythe_Gray_0 as SkinnedMesh).geometry,
                        (nodes.Scythe_Light_Gray_0 as SkinnedMesh).geometry,
                    ];
                case 37:
                    return [
                        (nodes.Traffic_light_1_Dark_Gray_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Traffic_light_1_Gray_Blue_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Traffic_light_1_Green_0 as SkinnedMesh).geometry,
                        (nodes.Traffic_light_1_Red_0 as SkinnedMesh).geometry,
                        (nodes.Traffic_light_1_Yellow_0 as SkinnedMesh)
                            .geometry,
                    ];
                case 38:
                    return [
                        (nodes.Traffic_light_2_Dark_Gray_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Traffic_light_2_Gray_Blue_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Traffic_light_2_Green_0 as SkinnedMesh).geometry,
                        (nodes.Traffic_light_2_Red_0 as SkinnedMesh).geometry,
                        (nodes.Traffic_light_2_Yellow_0 as SkinnedMesh)
                            .geometry,
                    ];
                case 39:
                    return [
                        (nodes.Tree_1_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Tree_1_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Tree_1_Dark_Gray_0 as SkinnedMesh).geometry,
                        (nodes.Tree_1_Forest_Green_0 as SkinnedMesh).geometry,
                        (nodes.Tree_1_Yellow_2_0 as SkinnedMesh).geometry,
                    ];
                case 40:
                    return [
                        (nodes.Tree_2_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Tree_2_Forest_Green_0 as SkinnedMesh).geometry,
                        (nodes.Tree_2_Red_0 as SkinnedMesh).geometry,
                    ];
                case 41:
                    return [
                        (nodes.Tree_4_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Tree_4_Grass_Green_0 as SkinnedMesh).geometry,
                    ];
                case 42:
                    return [
                        (nodes.Tree_5_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Tree_5_Dark_Gray_0 as SkinnedMesh).geometry,
                        (nodes.Tree_5_Forest_Green_0 as SkinnedMesh).geometry,
                    ];
                case 43:
                    return [
                        (nodes.Tree_6_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Tree_6_Forest_Green_0 as SkinnedMesh).geometry,
                    ];
                case 44:
                    return [
                        (nodes.Tree_7_Brown_2_0 as SkinnedMesh).geometry,
                        (nodes.Tree_7_Brown__0 as SkinnedMesh).geometry,
                        (nodes.Tree_7_Dark_Gray_0 as SkinnedMesh).geometry,
                        (nodes.Tree_7_Forest_Green_0 as SkinnedMesh).geometry,
                    ];
                case 45:
                    return [
                        (nodes.Tree_9_Brown__0 as SkinnedMesh).geometry,
                        (nodes.Tree_9_Gold__0 as SkinnedMesh).geometry,
                        (nodes.Tree_9_Orange_0 as SkinnedMesh).geometry,
                    ];
                case 46:
                    return [
                        (nodes.Tree_house_trunk__Brown_2_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Tree_house_trunk__Brown_3_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Tree_house_trunk__Brown_4_0 as SkinnedMesh)
                            .geometry,
                        (nodes.Tree_house_trunk__Brown__0 as SkinnedMesh)
                            .geometry,
                    ];
                case 47:
                    return [
                        (nodes.Tree_trunk_1_Brown_3_0 as SkinnedMesh).geometry,
                        (nodes.Tree_trunk_1_Brown_4_0 as SkinnedMesh).geometry,
                    ];
                case 48:
                    return [
                        (nodes.Wooden_box_Brown_4_0 as SkinnedMesh).geometry,
                        (nodes.Wooden_box_Gray_0 as SkinnedMesh).geometry,
                    ];

                default:
                    return [(nodes.Cabinet_18 as SkinnedMesh).geometry];
            }
        }
        return [(nodes.Cabinet_18 as SkinnedMesh).geometry];
    }
    function returnHeightSize(num: number | undefined) {
        if (roomState.roomMap === 'richRoom') {
            switch (num) {
                case 0:
                case 4:
                case 13:
                case 16:
                case 15:
                    return 0;
                case 14:
                    return 0.1;
                case 88:
                case 2:
                case 3:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 17:
                case 18:
                    return 0.2;
                case 77:
                case 78:
                case 1:
                    return 0.25;
                case 34:
                case 81:
                case 44:
                    return 0.3;
                case 94:
                case 48:
                case 39:
                case 40:
                    return 0.4;
                case 38:
                case 49:
                case 93:
                case 26:
                case 45:
                case 46:
                    return 0.5;
                case 82:
                    return 0.6;
                case 56:
                case 43:
                    return 0.7;
                case 74:
                case 76:
                case 41:
                    return 0.8;
                case 21:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 33:
                case 35:
                case 36:
                case 37:
                case 50:
                case 51:
                case 64:
                case 68:
                case 70:
                case 75:
                case 79:
                case 80:
                case 83:
                case 84:
                case 85:
                case 86:
                case 90:
                case 100:
                case 19:
                case 20:
                case 22:
                case 23:
                case 52:
                case 87:
                case 91:
                case 92:
                case 95:
                case 42:
                case 47:
                    return 1;
                case 58:
                case 60:
                case 61:
                    return 1.3;
                case 59:
                    return 1.4;
                case 57:
                case 62:
                case 69:
                case 53:
                    return 1.5;
                case 71:
                    return 1.6;
                case 63:
                case 65:
                case 66:
                case 67:
                case 89:
                    return 1.8;
                case 24:
                    return 2;
                case 96:
                    return 2.25;
                case 97:
                    return 2.45;
                case 55:
                    return 2.5;
                case 54:
                case 73:
                case 25:
                    return 3;
                case 98:
                    return 3.5;
                case 72:
                    return 4.25;
                case 99:
                    return 5;
                default:
                    return 1;
            }
        } else if (roomState.roomMap === 'farm') {
            switch (num) {
                case 0:
                case 1:
                case 36:
                    return 0.8;
                case 34:
                case 35:
                case 48:
                    return 0.6;
                case 4:
                    return 0.8;
                default:
                    return 1;
            }
        }
        return 1;
    }

    function returnRotation(num: number | undefined): Euler {
        let cnt = 1;
        if (roomState.roomMap === 'farm') {
            switch (num) {
                case 36:
                case 14:
                    cnt = 0.5;
                    break;
            }
        }
        return new Euler(cnt * Math.PI, 0, 0);
    }
};
