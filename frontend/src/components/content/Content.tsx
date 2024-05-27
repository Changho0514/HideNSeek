import { MainCanvas } from './canvas/MainCanvas';
import { CanvasLayout } from './canvasLayout/Layout';

import { useDispatch, useSelector } from 'react-redux';
import {
    CurrentPlayersInfo,
    RoomInfo,
    ThumbnailType,
} from '../../types/GameType';
import { useEffect, useState } from 'react';
import { meInfoState, meSelectedInfoState } from '../../store/user-slice';
import StompClient from '../../websocket/StompClient';
import RichRoomInfo from '../../json/RichRoomInfo.json';
import FarmInfo from '../../json/FarmInfo.json';

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
    // const rerollTime = useSelector(
    //     (state: any) => state.reduxFlag.userSlice.rerollTime
    // );
    //내정보.
    const [me, setMe] = useState<CurrentPlayersInfo>({
        direction: [0, 0, 0],
        position: [0, 0, 0],
        isDead: null,
        isSeeker: null,
        nickname: '',
        selectedIndex: 5,
    });
    const [selectCount, setSelectCount] = useState<number>(0);
    //플레이어 전체정보
    const [players, setPlayers] = useState<CurrentPlayersInfo[]>(
        roomState.roomPlayers
    );
    const [choice, setChoice] = useState<number[]>([1, 2, 3]);
    const [rerollFlag, setRerollFlag] = useState<boolean[]>([
        false,
        false,
        false,
    ]);
    const [choiceFlag, setChoiceFlag] = useState<boolean>(false);
    const [secondChoiceFlag, setSecondChoiceFlag] = useState<boolean>(false);
    const [thumbnailInfo, setThumbnailInfo] =
        useState<ThumbnailType[]>(RichRoomInfo);

    useEffect(() => {
        if (meInfo.nickname !== '') {
            setMe(meInfo);
        }
    }, [meInfo]);
    useEffect(() => {
        if (roomState) {
            roomState.roomPlayers.map((item: CurrentPlayersInfo) => {
                if (item.nickname == meName) {
                    dispatch(meInfoState(item));
                }
            });
        }
        setPlayers(roomState.roomPlayers);
        if (roomState.roomMap === 'richRoom') {
            setThumbnailInfo(RichRoomInfo);
        } else if (roomState.roomMap === 'farm') {
            setThumbnailInfo(FarmInfo);
        } else {
            setThumbnailInfo(RichRoomInfo);
        }
    }, [roomState]);
    // useEffect(() => {
    //     if (rerollTime === 1) {
    //         const randomChoice = [
    //             Math.floor(Math.random() * 100),
    //             Math.floor(Math.random() * 100),
    //             Math.floor(Math.random() * 100),
    //         ];
    //         setChoice(randomChoice);
    //         setChoiceFlag(false);
    //         setSecondChoiceFlag(true);
    //     }
    // }, [rerollTime]);

    useEffect(() => {
        // console.log('선택 랜덤');
        if (roomState.roomState === 3 && meInfo.selectedIndex == null) {
            // console.log('작동1');
            const random = Math.floor(Math.random() * 3);
            setMe((prevMe) => ({ ...prevMe, selectedIndex: choice[random] })); // 새 객체를 반환하여 selectedIndex 업데이트

            // console.log('처음 players', players);
            const updatedPlayers = players.map((player) => {
                if (player.nickname === me.nickname && !choiceFlag) {
                    setMe((prev) => ({
                        ...prev,
                        selectedIndex: choice[random],
                    }));
                    setChoiceFlag(true);
                    stompClient.sendMessage(
                        `/player.object`,
                        JSON.stringify({
                            type: 'player.object',
                            roomId: roomState.roomId,
                            sender: meName,
                            data: {
                                nickname: me.nickname,
                                selectedIndex: choice[random],
                                position: me.position,
                                direction: me.direction,
                                isDead: me.isDead,
                                isSeeker: me.isSeeker,
                            },
                        })
                    );
                    return { ...player, selectedIndex: choice[random] };
                }
                return player;
            });
            setPlayers(updatedPlayers);
            setSelectCount((prev) => prev + 1);
            // console.log('바뀐 Player정보', updatedPlayers);
            dispatch(meSelectedInfoState(choice[random]));
        }
        // if (
        //     roomState.roomState === 3 &&
        //     rerollTime === 2 &&
        //     selectCount !== 2
        // ) {
        //     console.log('작동2');
        //     const random = Math.floor(Math.random() * 3);
        //     setMe((prevMe) => ({ ...prevMe, selectedIndex: choice[random] })); // 새 객체를 반환하여 selectedIndex 업데이트

        //     // console.log('처음 players', players);
        //     const updatedPlayers = players.map((player) => {
        //         if (player.nickname === me.nickname && !choiceFlag) {
        //             setMe((prev) => ({
        //                 ...prev,
        //                 selectedIndex: choice[random],
        //             }));
        //             setChoiceFlag(true);
        //             stompClient.sendMessage(
        //                 `/player.object`,
        //                 JSON.stringify({
        //                     type: 'player.object',
        //                     roomId: roomState.roomId,
        //                     sender: meName,
        //                     data: {
        //                         nickname: me.nickname,
        //                         selectedIndex: choice[random],
        //                         position: me.position,
        //                         direction: me.direction,
        //                         isDead: me.isDead,
        //                         isSeeker: me.isSeeker,
        //                     },
        //                 })
        //             );
        //             return { ...player, selectedIndex: choice[random] };
        //         }
        //         return player;
        //     });
        //     setPlayers(updatedPlayers);
        //     setSelectCount((prev) => prev + 1);
        //     // console.log('바뀐 Player정보', updatedPlayers);
        //     dispatch(meSelectedInfoState(choice[random]));
        //     setSecondChoiceFlag(false);
        // }
    }, [roomState.roomState]);
    useEffect(() => {
        let rerollChoice: number[];

        if (roomState.roomMap === 'richRoom') {
            rerollChoice = [
                Math.floor(Math.random() * 98 + 2),
                Math.floor(Math.random() * 98 + 2),
                Math.floor(99),
            ];
        } else if (roomState.roomMap === 'farm') {
            rerollChoice = [
                Math.floor(Math.random() * 49),
                Math.floor(Math.random() * 49),
                Math.floor(Math.random() * 49),
            ];
        } else {
            rerollChoice = [
                Math.floor(Math.random() * 98 + 2),
                Math.floor(Math.random() * 98 + 2),
                Math.floor(Math.random() * 98 + 2),
            ];
        }
        // console.log('숫자 배정', randomChoice);
        setChoice(rerollChoice);
        console.log(rerollChoice);
    }, []);

    const handleSelectedIndex = (index: number) => {
        setMe((prevMe) => ({ ...prevMe, selectedIndex: index })); // 새 객체를 반환하여 selectedIndex 업데이트

        // console.log('처음 players', players);
        // console.log(choiceFlag, index);
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
        setSelectCount((prev) => prev + 1);
        dispatch(meSelectedInfoState(index));
        setSecondChoiceFlag(false);
    };

    const rerollIndex = (num: number) => {
        if (!rerollFlag[num]) {
            const newChoice = [...choice];
            if (roomState.roomMap === 'richRoom') {
                newChoice[num] = Math.floor(Math.random() * 100);
            } else if (roomState.roomMap === 'farm') {
                newChoice[num] = Math.floor(Math.random() * 49);
            } else {
                newChoice[num] = Math.floor(Math.random() * 100);
            }
            setChoice(newChoice);
            const newRerollFlag = [...rerollFlag];
            newRerollFlag[num] = true;
            setRerollFlag(newRerollFlag);
        }
    };

    return (
        <>
            {me ? (
                <CanvasLayout>
                    {(roomState.roomState === 1 || roomState.roomState === 2) &&
                    !me.isSeeker &&
                    me.selectedIndex === null ? (
                        //     ||
                        // (roomState.roomState === 3 &&
                        //     !me.isSeeker &&
                        //     rerollTime === 1 &&
                        //     !choiceFlag &&
                        //     !me.isDead)
                        <>
                            <div className="absolute flex items-center justify-between w-[80%] h-[80%] z-10">
                                {choice.map((item, index) => {
                                    return (
                                        <div
                                            key={'selectKey :' + index}
                                            className="w-[30%] h-[80%] flex flex-col justify-center items-center bg-white border-[0.4vw] rounded-[0.6vw] border-gray-700"
                                        >
                                            <img
                                                className="relative w-50 h-40 object-fill"
                                                src={
                                                    thumbnailInfo[item]
                                                        .thumbnail
                                                }
                                                alt=""
                                            />
                                            {thumbnailInfo[item].name}
                                            <p
                                                className="bg-red-200 px-[2vw] py-[1vw] rounded-[0.6vw] border-[0.2vw] border-red-500 cursor-pointer"
                                                onClick={() => {
                                                    handleSelectedIndex(item);
                                                }}
                                            >
                                                선택하기
                                            </p>
                                            <p
                                                className=" py-[1vw] px-[1vw] bg-sky-200 border-[0.2vw] border-sky-400 rounded-[0.6vw] my-[0.4vw] cursor-pointer"
                                                onClick={() => {
                                                    rerollIndex(index);
                                                }}
                                                style={
                                                    rerollFlag[index]
                                                        ? {
                                                              backgroundColor:
                                                                  'gray',
                                                          }
                                                        : {}
                                                }
                                            >
                                                다시뽑기
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* <div className="absolute flex justify-center bottom-8 text-[2vw] z-10">
                                20초 후에 셋 중 하나의 물체로 변신합니다. ESC 후
                                선택하세요.
                            </div> */}
                        </>
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
