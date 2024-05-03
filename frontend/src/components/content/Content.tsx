import { MainCanvas } from './canvas/MainCanvas';
import { CanvasLayout } from './canvasLayout/Layout';

import { useDispatch, useSelector } from 'react-redux';
import { CurrentPlayersInfo, RoomInfo } from '../../types/GameType';
import { useEffect, useState } from 'react';
import { meInfoState, meSelectedInfoState } from '../../store/user-slice';
import StompClient from '../../websocket/StompClient';
import ObjectInfo from '../../json/ObjectInfo.json';
export function Content() {
    const dispatch = useDispatch();
    const stompClient = StompClient.getInstance();
    //방정보.
    const roomState: RoomInfo = useSelector(
        (state: any) => state.reduxFlag.userSlice.currentRoom
    );
    const meName = useSelector(
        (state: any) => state.reduxFlag.userSlice.userNickname
    );
    const meInfo = useSelector(
        (state: any) => state.reduxFlag.userSlice.meInfo
    );
    const givenChoice = useSelector(
        (state: any) => state.reduxFlag.userSlice.givenChoice
    );
    //내정보.
    const [me, setMe] = useState<CurrentPlayersInfo>({
        direction: [0, 0, 0],
        position: [0, 0, 0],
        isDead: null,
        isSeeker: null,
        nickname: '',
        selectedIndex: 5,
    });
    //플레이어 전체정보
    const [players, setPlayers] = useState<CurrentPlayersInfo[]>(
        roomState.roomPlayers
    );
    const [choice, setChoice] = useState<number[]>([1, 2, 3]);
    const [choiceFlag, setChoiceFlag] = useState<boolean>(false);
    useEffect(() => {
        if (meInfo.nickname !== '') {
            setMe(meInfo);
        }
    }, [meInfo]);
    useEffect(() => {
        setPlayers(roomState.roomPlayers);
    }, [roomState]);

    useEffect(() => {
        if (roomState) {
            roomState.roomPlayers.map((item: CurrentPlayersInfo) => {
                if (item.nickname == meName) {
                    dispatch(meInfoState(item));
                }
            });
        }
    }, [roomState]);
    useEffect(() => {
        if (givenChoice.length === 3) {
            setChoice(givenChoice);
            console.log(givenChoice);
        }
    }, [givenChoice]);

    const handleSelectedIndex = (index: number) => {
        setMe((prevMe) => ({ ...prevMe, selectedIndex: index })); // 새 객체를 반환하여 selectedIndex 업데이트

        console.log('처음 players', players);
        const updatedPlayers = players.map((player) => {
            if (player.nickname === me.nickname && !choiceFlag) {
                setMe((prev) => ({ ...prev, selectedIndex: index }));
                setChoiceFlag(true);
                stompClient.sendMessage(
                    `/player.object`,
                    JSON.stringify({
                        type: 'player.object',
                        roomId: roomState.roomId,
                        sender: meName,
                        data: {
                            nickname: me.nickname,
                            selectedIndex: index,
                            position: me.position,
                            direction: me.direction,
                            isDead: me.isDead,
                            isSeeker: me.isSeeker,
                        },
                    })
                );
                return { ...player, selectedIndex: index };
            }
            return player;
        });
        setPlayers(updatedPlayers);
        console.log('바뀐 Player정보', updatedPlayers);
        dispatch(meSelectedInfoState(index));
    };

    return (
        <>
            {me ? (
                <CanvasLayout>
                    {(roomState.roomState === 1 || roomState.roomState === 2) &&
                    !me.isSeeker &&
                    me.selectedIndex === null ? (
                        <div className="absolute flex items-center justify-between w-[80%] h-[80%] z-10">
                            {choice.map((item, index) => {
                                return (
                                    <div
                                        key={'selectKey :' + index}
                                        className="w-[30%] h-[80%] flex flex-col justify-center items-center bg-white border-[0.4vw] rounded-[0.6vw] border-gray-700"
                                    >
                                        <img
                                            className="relative w-50 h-40 object-fill"
                                            src={ObjectInfo[item].thumbnail}
                                            alt=""
                                        />
                                        {ObjectInfo[item].name}
                                        <p
                                            className="bg-red-200 px-[2vw] py-[1vw] rounded-[0.6vw] border-[0.2vw] border-red-500 cursor-pointer"
                                            onClick={() => {
                                                handleSelectedIndex(item);
                                            }}
                                        >
                                            선택하기
                                        </p>
                                        <p className=" py-[1vw] px-[1vw] bg-sky-200 border-[0.2vw] border-sky-400 rounded-[0.6vw] my-[0.4vw] cursor-pointer">
                                            리롤하기
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <></>
                    )}
                    <MainCanvas />
                </CanvasLayout>
            ) : (
                <></>
            )}
        </>
    );
}
