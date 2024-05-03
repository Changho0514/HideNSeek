import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { PlayerAtom } from '../../../../../store/PlayersAtom';
import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from 'three';
import { useSelector } from 'react-redux';
import { CurrentPlayersInfo } from '../../../../../types/GameType';
import { useThree } from '@react-three/fiber';
import StompClient from '../../../../../websocket/StompClient';

export function AttackRules() {
    const [, setDetectedObject] = useState<any>(null);
    const [rayVisual, setRayVisual] = useState<any>(null); // 레이 시각화 객체 상태
    const stompClient = StompClient.getInstance();
    const { camera, scene, raycaster } = useThree();
    const currentRoom = useSelector(
        (state: any) => state.reduxFlag.userSlice.currentRoom
    );
    const meName = useSelector(
        (state: any) => state.reduxFlag.userSlice.userNickname
    );
    const [players] = useRecoilState(PlayerAtom);
    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === 'k') {
                handleInteraction();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [players, rayVisual]);

    const handleInteraction = () => {
        console.log('간다 공격!~');
        const newPlayers = currentRoom.roomPlayers.map(
            (player: CurrentPlayersInfo) => ({
                ...player,
                position: new Vector3(...player.position),
            })
        );
        const seeker = newPlayers.find(
            (p: CurrentPlayersInfo) => p.isSeeker && !p.isDead
        );
        // console.log(seeker);

        if (seeker && seeker.nickname === meName) {
            const direction = new Vector3();
            camera.getWorldDirection(direction); // 카메라의 방향을 얻음

            raycaster.set(camera.position, direction); // 카메라 위치와 방향을 기반으로 레이캐스터 설정
            const intersects = raycaster.intersectObjects(scene.children, true);

            console.log(seeker.position);
            if (intersects.length > 0) {
                const closestObject = intersects[0].object;
                console.log('감지된 객체:', closestObject);
                setDetectedObject(closestObject);
                drawRayLine(camera.position, intersects[0].point); // 레이를 그리는 함수 호출
                currentRoom.roomPlayers.map((item: CurrentPlayersInfo) => {
                    // 모든 부모 이름을 가져옵니다.
                    const parentNames = getParentNames(closestObject);
                    if (!item.isDead && parentNames.includes(item.nickname)) {
                        console.log('죽인다 빵야빵야');
                        stompClient.sendMessage(
                            `/player.dead`,
                            JSON.stringify({
                                type: 'player.enter',
                                roomId: currentRoom.roomId,
                                sender: item.nickname,
                                data: {
                                    nickname: item.nickname,
                                    isDead: true,
                                },
                            })
                        );
                        // item.isDead = true;
                    }
                });
                // closestObject.parent?.name 지준영
            }
        }
    };
    const drawRayLine = (start: any, end: any) => {
        // 라인 재료와 지오메트리 생성
        const material = new LineBasicMaterial({
            color: 0xff0000,
        });
        const points = [start, end];
        const geometry = new BufferGeometry().setFromPoints(points);

        // 기존 라인이 있으면 씬에서 제거
        if (rayVisual) scene.remove(rayVisual);

        // 새로운 라인 생성
        const line = new Line(geometry, material);
        scene.add(line);
        setRayVisual(line);
    };

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
