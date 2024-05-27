import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CurrentPlayersInfo } from '../../../../../types/GameType';
import { useThree } from '@react-three/fiber';
import StompClient from '../../../../../websocket/StompClient';
import {
    deadPeopleState,
    decrementHeartState,
    heartState,
} from '../../../../../store/user-slice';
import { Vector3 } from 'three';

export function AttackRules() {
    const [, setDetectedObject] = useState<any>(null);
    // const [rayVisual, _] = useState<any>(null); // 레이 시각화 객체 상태
    const stompClient = StompClient.getInstance();
    const { camera, scene, raycaster } = useThree();
    const currentRoom = useSelector(
        (state: any) => state.reduxFlag.userSlice.currentRoom
    );
    const meName = useSelector(
        (state: any) => state.reduxFlag.userSlice.userNickname
    );
    const meInfo = useSelector(
        (state: any) => state.reduxFlag.userSlice.meInfo
    );
    const [roomState, setRoomState] = useState<number>(0);
    // const meHeart = useSelector(
    //     (state: any) => state.reduxFlag.userSlice.meHeart
    // );
    const dispatch = useDispatch();
    useEffect(() => {
        if (meInfo.isSeeker) {
            const handleKeyDown = (event: MouseEvent) => {
                if (event.button === 0) {
                    handleInteraction();
                }
            };

            window.addEventListener('mousedown', handleKeyDown);
            return () => window.removeEventListener('mousedown', handleKeyDown);
        }
    }, [roomState]);

    useEffect(() => {
        setRoomState(currentRoom.roomState);
    }, [currentRoom.roomState]);

    const handleInteraction = () => {
        if (roomState === 3) {
            const newPlayers = currentRoom.roomPlayers.map(
                (player: CurrentPlayersInfo) => ({
                    ...player,
                    position: new Vector3(...player.position),
                })
            );

            const seeker = newPlayers.find(
                (p: CurrentPlayersInfo) =>
                    p.isSeeker && !p.isDead && p.nickname === meName
            );
            // console.log(seeker);

            if (seeker && seeker.nickname === meName) {
                // console.log('간다 공격!~');
                let killFlag = false;
                // console.log(killFlag, meHeart);

                const direction = new Vector3();
                camera.getWorldDirection(direction); // 카메라의 방향을 얻음

                raycaster.params.Mesh.threshold = 4;
                raycaster.set(camera.position, direction); // 카메라 위치와 방향을 기반으로 레이캐스터 설정
                const intersects = raycaster.intersectObjects(
                    scene.children,
                    true
                );

                // console.log(seeker.position);
                if (intersects.length > 0) {
                    let flag = false;
                    intersects.map((obj, index) => {
                        if (index > 8 || flag) {
                            return;
                        }
                        const closestObject = obj.object;
                        // console.log('감지된 객체:', closestObject);
                        setDetectedObject(closestObject);
                        // drawRayLine(camera.position, intersects[0].point); // 레이를 그리는 함수 호출
                        currentRoom.roomPlayers.map(
                            (item: CurrentPlayersInfo, index: number) => {
                                // 모든 부모 이름을 가져옵니다.
                                const parentNames =
                                    getParentNames(closestObject);
                                if (
                                    !item.isDead &&
                                    parentNames.includes(item.nickname) &&
                                    !item.isSeeker
                                ) {
                                    // console.log('죽인다 빵야빵야');
                                    killFlag = true;
                                    dispatch(heartState(7));
                                    stompClient.sendMessage(
                                        `/player.dead`,
                                        JSON.stringify({
                                            type: 'player.dead',
                                            roomId: currentRoom.roomId,
                                            sender: item.nickname,
                                            data: {
                                                nickname: item.nickname,
                                                isDead: true,
                                            },
                                        })
                                    );
                                    const data = `도망자 '${item.nickname}' 님이 발견됐습니다.`;
                                    stompClient.sendMessage(
                                        `/chat.player`,
                                        JSON.stringify({
                                            type: 'chat.player',
                                            roomId: currentRoom.roomId,
                                            sender: meInfo.nickname,
                                            data: {
                                                nickname: '<SYSTEM>',
                                                content: data,
                                            },
                                        })
                                    );
                                    flag = true;
                                    dispatch(deadPeopleState(index));
                                    return { ...item, isDead: true };
                                }
                                return item;
                            }
                        );
                    });
                    if (!killFlag) {
                        dispatch(decrementHeartState());
                        killFlag = false;
                    }
                    // closestObject.parent?.name 지준영
                }
            }
        }
    };
    // const drawRayLine = (start: any, end: any) => {
    //     // 라인 재료와 지오메트리 생성
    //     const material = new LineBasicMaterial({
    //         color: 0xff0000,
    //     });
    //     const points = [start, end];
    //     const geometry = new BufferGeometry().setFromPoints(points);

    //     // 기존 라인이 있으면 씬에서 제거
    //     if (rayVisual) scene.remove(rayVisual);

    //     // 새로운 라인 생성
    //     const line = new Line(geometry, material);
    //     scene.add(line);
    //     setRayVisual(line);
    // };

    const getParentNames = (object: any) => {
        let names = [];
        let currentObject = object;
        while (currentObject.parent) {
            names.push(currentObject.parent.name);
            currentObject = currentObject.parent;
        }
        return names;
    };
    return <></>;
}
