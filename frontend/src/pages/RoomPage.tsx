/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatType, RoomInfo } from '../types/GameType';
import { getRoom } from '../api/rooms';
import { httpStatusCode } from '../components/utils/http-status';
import { useDispatch, useSelector } from 'react-redux';
import StompClient from '../websocket/StompClient';
import {
    chatDataState,
    currentRoomState,
    mapSizeState,
    readyState,
    rerollState,
} from '../store/user-slice';
import backgroundImage from '../assets/images/bg/background-main.png';
import RichMap from '../assets/images/bg/map-Rich.png';
import farmMap from '../assets/images/bg/map-Farm.png';

export default function RoomPage() {
    const mapInfo = ['richRoom'];
    const mapKoreanInfo = ['저택'];
    const [settingRoomFlag, setSettingRoomFlag] = useState<boolean>(false);
    const [botCount, setBotCount] = useState(0);
    const [room, setRoom] = useState<RoomInfo>({
        isPublic: true,
        roomId: '',
        roomAdmin: '',
        roomMap: '',
        roomPassword: '',
        roomPlayers: [],
        roomState: 0,
        roomTime: 0,
        roomTitle: '',
        botCnt: 0,
        mapValue: null,
    });
    const [mapIndex, setMapIndex] = useState<number>(0);
    const [mapthumb, setMapThumb] = useState<string>(RichMap);
    const [modifyTitle, setModifyTitle] = useState<string>('');
    const [modifyPassword, setModifyPassword] = useState<string>('');
    const [modifyPublicFlag, setModifyPublicFlag] = useState<boolean>(false);
    const stompClient = StompClient.getInstance();
    const { state } = useLocation();
    const navigate = useNavigate();
    const changeSettingRoomFlag = () => {
        setSettingRoomFlag(!settingRoomFlag);
    };
    const meName = useSelector(
        (state: any) => state.reduxFlag.userSlice.userNickname
    );
    const isReady = useSelector(
        (state: any) => state.reduxFlag.userSlice.isReady
    );
    const currentRoom = useSelector(
        (state: any) => state.reduxFlag.userSlice.currentRoom
    );
    const channelIndex = useSelector(
        (state: any) => state.reduxFlag.userSlice.channelIndex
    );

    ///////// 채팅 관련 //////////
    const chatList = useSelector(
        (state: any) => state.reduxFlag.userSlice.chatData
    );
    const [chatContent, setChatContent] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    //스크롤 탐지용
    const messageEndRef = useRef<HTMLDivElement>(null);
    ///////// 채팅 관련 //////////

    const dispatch = useDispatch();
    const loadRoom = async (state: string) => {
        const res = await getRoom(state, channelIndex);
        if (res.status === httpStatusCode.OK) {
            // console.log(res.data);
            setRoom(res.data.data);
            dispatch(currentRoomState(res.data.data));
        }
    };

    const playGame = () => {
        if (currentRoom.roomMap === 'richRoom') {
            dispatch(
                mapSizeState({
                    minX: -60,
                    maxX: 40,
                    minZ: -40,
                    maxZ: 90,
                    minY: -1,
                    maxY: 10,
                })
            );
        } else if (currentRoom.roomMap === 'farm') {
            dispatch(
                mapSizeState({
                    minX: -76,
                    maxX: 76,
                    minZ: -76,
                    maxZ: 76,
                    minY: -3,
                    maxY: 8,
                })
            );
        } else {
            dispatch(
                mapSizeState({
                    minX: -60,
                    maxX: 40,
                    minZ: -40,
                    maxZ: 90,
                    minY: -1,
                    maxY: 10,
                })
            );
        }
        dispatch(chatDataState([]));
        if (currentRoom.roomAdmin === meName) {
            console.log('시작 룸', room);
            stompClient.sendMessage(
                `/room.gameInit`,
                JSON.stringify({
                    type: 'room.gameInit',
                    roomId: state,
                    sender: meName,
                    data: {
                        room,
                    },
                })
            );
            navigate(`/game/${state}`, { state: state });
        } else {
            alert('방장만 시작 할 수 있습니다.');
        }
    };

    useEffect(() => {
        dispatch(readyState(false));
        dispatch(chatDataState([]));
        dispatch(rerollState(0));
    }, []);
    useEffect(() => {
        if (state) {
            loadRoom(state);
        }
    }, [state]);
    useEffect(() => {
        if (isReady) {
            navigate(`/game/${state}`, { state: state });
        }
    }, [isReady]);
    useEffect(() => {
        // console.log('방정보', currentRoom);
        setRoom(currentRoom);
        setBotCount(currentRoom.botCnt);
        if (currentRoom.roomMap === 'richRoom') {
            setMapThumb(RichMap);
        } else if (currentRoom.roomMap === 'farm') {
            setMapThumb(farmMap);
        }
    }, [currentRoom]);
    useEffect(() => {
        // console.log('바뀐정보', room);
    }, [room]);
    useEffect(() => {
        if (
            currentRoom.roomAdmin === meName &&
            room.roomId &&
            room.roomTitle &&
            room.roomPlayers
        ) {
            stompClient.sendMessage(
                `/room.modify`,
                JSON.stringify({
                    type: 'room.modify',
                    roomId: currentRoom.roomId,
                    sender: meName,
                    data: {
                        roomId: room.roomId,
                        roomAdmin: room.roomAdmin,
                        roomTitle: room.roomTitle,
                        roomPassword: room.roomPassword,
                        roomState: room.roomState,
                        roomTime: room.roomTime,
                        roomMap: mapInfo[mapIndex],
                        roomPlayers: room.roomPlayers,
                        botCnt: botCount,
                    },
                })
            );
        }
    }, [mapIndex, botCount]);

    const sendEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (inputRef.current && chatContent !== '') {
                // console.log('보낼게염');
                stompClient.sendMessage(
                    `/chat.player`,
                    JSON.stringify({
                        type: 'chat.player',
                        roomId: currentRoom.roomId,
                        sender: meName,
                        data: {
                            nickname: meName,
                            content: chatContent,
                        },
                    })
                );
                setChatContent('');
            }
        }
    };
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }, [chatList]);

    const outRoom = () => {
        stompClient.sendMessage(
            `/player.exit`,
            JSON.stringify({
                type: 'player.exit',
                roomId: state,
                sender: meName,
                data: {
                    nickname: meName,
                },
            })
        );
        window.location.replace('/lobby');
    };

    const prevMap = () => {
        if (mapIndex <= 0) {
            setMapIndex(mapInfo.length - 1);
        } else {
            setMapIndex((prev) => prev - 1);
        }
    };
    const nextMap = () => {
        if (mapIndex >= mapInfo.length - 1) {
            setMapIndex(0);
        } else {
            setMapIndex((prev) => prev + 1);
        }
    };
    const handleBotCntIncrease = () => {
        if (currentRoom.roomAdmin == meName)
            setBotCount(botCount >= 3 ? 4 : botCount + 1);
    };

    const handleBotCntDecrease = () => {
        if (currentRoom.roomAdmin == meName)
            setBotCount(botCount > 0 ? botCount - 1 : 0);
    };

    const changeRoomState = () => {
        if (modifyTitle === '') {
            alert('제목을 입력해주세요');
        } else if (modifyPassword !== '') {
            stompClient.sendMessage(
                `/room.modify`,
                JSON.stringify({
                    type: 'room.modify',
                    roomId: currentRoom.roomId,
                    sender: meName,
                    data: {
                        roomId: room.roomId,
                        roomAdmin: room.roomAdmin,
                        roomTitle: modifyTitle,
                        roomPassword: modifyPassword,
                        roomState: room.roomState,
                        roomTime: room.roomTime,
                        roomMap: mapInfo[mapIndex],
                        roomPlayers: room.roomPlayers,
                        isPublic: modifyPublicFlag,
                        botCnt: botCount,
                    },
                })
            );
            setModifyTitle('');
            setModifyPassword('');
            changeSettingRoomFlag();
        } else {
            stompClient.sendMessage(
                `/room.modify`,
                JSON.stringify({
                    type: 'room.modify',
                    roomId: currentRoom.roomId,
                    sender: meName,
                    data: {
                        roomId: room.roomId,
                        roomAdmin: room.roomAdmin,
                        roomTitle: modifyTitle,
                        roomState: room.roomState,
                        roomTime: room.roomTime,
                        roomMap: mapInfo[mapIndex],
                        roomPlayers: room.roomPlayers,
                        isPublic: modifyPublicFlag,
                        botCnt: botCount,
                    },
                })
            );
            setModifyTitle('');
            setModifyPassword('');
            changeSettingRoomFlag();
        }
    };

    return (
        <section
            className="relative w-full h-full flex flex-col items-center justify-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <div className="relative w-[80%] h-[90%] p-[0.6vw] flex justify-between border-[0.3vw] rounded-[0.6vw] border-white color-bg-sublight ">
                <div className="w-[60%] h-full flex-col justify-center">
                    <div className="w-full h-[12%] flex justify-between items-center mx-auto my-[1vw] px-[1vw] py-[0.8vw] text-[1.2vw] border-[0.2vw] bg-white border-white rounded-[0.6vw] ">
                        <p className="w-[80%] text-start whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {room?.roomTitle}
                        </p>
                        {room?.roomAdmin === meName ? (
                            <p
                                className="cursor-pointer"
                                onClick={() => {
                                    changeSettingRoomFlag();
                                }}
                            >
                                변경
                            </p>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="w-full h-[86%] flex flex-wrap content-start ">
                        <div className="w-full h-[60%] flex flex-wrap content-start overflow-auto">
                            {room?.roomPlayers.map((item, index) => {
                                return (
                                    <div
                                        key={'currentPeople' + index}
                                        className="w-[45%] h-[15%] px-[1vw] my-[0.3vw] mx-[0.4vw] flex justify-between items-center border-[0.3vw] rounded-[0.6vw] cursor-pointer border-white color-bg-main color-text-black hover:color-bg-subbold "
                                        style={
                                            item.nickname === meName
                                                ? {
                                                      borderColor: '#2e2e2e',
                                                      color: '#2e2e2e',
                                                      backgroundColor: '#fff',
                                                  }
                                                : {}
                                        }
                                    >
                                        <p className="w-[80%] text-[1.4vw] text-start whitespace-nowrap overflow-hidden overflow-ellipsis">
                                            {item.nickname}
                                        </p>
                                        {room?.roomAdmin === item.nickname ? (
                                            <div className="w-[20%] flex flex-col">
                                                <p className="text-[1.4vw]">
                                                    방장
                                                </p>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-full h-[34%] bg-white my-[0.6vw] mx-[0.4vw] rounded-[0.6vw]">
                            <div className="w-[full] h-[85%] p-[0.4vw] overflow-auto">
                                {chatList.map(
                                    (item: ChatType, index: number) => {
                                        return (
                                            <div
                                                className="w-full flex items-center justify-start my-1 text-[1.1vw]"
                                                key={'chat key : ' + index}
                                            >
                                                <p className="w-[18%] text-start whitespace-nowrap overflow-hidden overflow-ellipsis">
                                                    {item.nickname}
                                                </p>
                                                <p className="w-[2%]">:</p>
                                                <p className="w-[80%] text-start">
                                                    {item.content}
                                                </p>
                                            </div>
                                        );
                                    }
                                )}
                                <div ref={messageEndRef}></div>
                            </div>
                            <input
                                ref={inputRef}
                                className="w-[99%] h-[15%] py-[0.4vw] text-[1vw] overflow-auto border px-[0.2vw] border-none"
                                value={chatContent}
                                onChange={(e) => {
                                    setChatContent(e.target.value);
                                }}
                                placeholder="채팅을 입력해주세요"
                                onKeyDown={sendEnter}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-[40%] h-full flex flex-col items-center justify-around">
                    <div className="h-[60%] flex flex-col items-center">
                        <img
                            className="w-[70%] border-[0.3vw] border-white rounded-[0.6vw] bg-white"
                            src={mapthumb}
                            alt=""
                            style={{ aspectRatio: 1 / 1 }}
                        />
                        <p className="text-[1.6vw]">
                            {mapKoreanInfo[mapIndex]}
                        </p>
                    </div>

                    <div className="w-[90%] h-[30%] flex flex-col items-center color-text-black border-[0.2vw] border-white my-[1vw] px-[0.4vw] bg-white bg-opacity-30 rounded-[0.8vw]">
                        <p className="w-full text-[1.6vw] text-start mt-[0.4vw]">
                            게임설정
                        </p>
                        <div className="w-full flex items-center justify-between text-[1.3vw] my-[0.6vw]">
                            <p className="">맵</p>
                            <div className="flex text-[1.3vwvw] color-text-black">
                                {currentRoom.roomAdmin === meName ? (
                                    <p
                                        className="mx-[1vw] cursor-pointer"
                                        onClick={prevMap}
                                    >
                                        ⬅
                                    </p>
                                ) : (
                                    <></>
                                )}
                                <p>{mapKoreanInfo[mapIndex]}</p>
                                {currentRoom.roomAdmin === meName ? (
                                    <p
                                        className="mx-[1vw] cursor-pointer"
                                        onClick={nextMap}
                                    >
                                        ➡
                                    </p>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-between text-[1.3vw]">
                            <p className="">봇의 개수</p>
                            <div className="flex color-text-black">
                                <button
                                    className="mx-[1vw]"
                                    onClick={() => handleBotCntDecrease()}
                                >
                                    {' '}
                                    -{' '}
                                </button>
                                <p>{botCount}</p>
                                <button
                                    className="mx-[1vw]"
                                    onClick={() => handleBotCntIncrease()}
                                >
                                    {' '}
                                    +{' '}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-[10%] w-full flex justify-center">
                        <div
                            className="w-[45%] h-full flex items-center justify-center mx-[1vw] px-[1vw] bg-rose-400 color-text-black py-[1vw] border-[0.3vw] rounded-[0.6vw] border-white cursor-pointer hover:bg-red-500 hover:color-text-black hover:border-red-500 "
                            onClick={() => {
                                outRoom();
                            }}
                        >
                            <p className="text-[1.4vw]">나가기</p>
                        </div>
                        {room?.roomAdmin === meName ? (
                            <div
                                className="w-[45%] h-full flex items-center justify-center mx-[1vw] px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-white color-bg-main cursor-pointer hover:color-bg-subbold hover:color-text-black hover:color-border-subbold"
                                onClick={() => {
                                    playGame();
                                }}
                            >
                                <p className="text-[1.4vw] color-text-black ">
                                    게임시작
                                </p>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            {settingRoomFlag ? (
                <div className="absolute w-[40%]  flex flex-col items-center justify-between border-[0.3vw] rounded-[0.6vw] border-white color-bg-main color-text-black overflow-y-auto">
                    <div className="w-full flex flex-col items-center text-white">
                        <p className="text-3xl my-[1vw]">방 수정하기</p>
                        <div className="relative w-[90%] flex justify-start items-center my-[0.4vw]">
                            <p className="w-[40%] text-2xl">제목 수정 : </p>
                            <input
                                className="w-[60%] border-[0.2vw] color-text-black border-white px-[1vw] py-[0.4vw] mx-[1vw]"
                                type="text"
                                name=""
                                id=""
                                value={modifyTitle}
                                onChange={(e) => {
                                    setModifyTitle(e.target.value);
                                }}
                            />
                        </div>
                        <div className="relative w-[90%] flex justify-start items-center my-[0.4vw]">
                            <p className="w-[40%] text-2xl">비밀번호 수정 : </p>
                            <input
                                className="w-[60%] border-[0.2vw] color-text-black border-white px-[1vw] py-[0.4vw] mx-[1vw]"
                                type="text"
                                name=""
                                id=""
                                value={modifyPassword}
                                onChange={(e) => {
                                    setModifyPassword(e.target.value);
                                }}
                            />
                        </div>
                        <div className="w-[90%] flex justify-end items-center">
                            <p>비밀방</p>
                            <div
                                className={`w-[1.4vw] h-[1.4vw] border-[0.2vw] mx-[0.4vw] color-border-main bg-white cursor-pointer ${
                                    modifyPublicFlag ? '' : 'color-bg-subbold'
                                }`}
                                onClick={() => {
                                    setModifyPublicFlag(!modifyPublicFlag);
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="relative w-[90%] flex justify-between items-center my-[1vw]">
                        <div
                            className="w-[30%] h-full px-[1vw] py-[1vw] border-[0.3vw] text-white rounded-[0.6vw] border-white cursor-pointer hover:color-bg-subbold hover:text-white hover:color-border-subbold"
                            onClick={() => {
                                changeRoomState();
                            }}
                        >
                            <p className="text-[1.4vw]">수정하기</p>
                        </div>
                        <div
                            className="w-[30%] h-full px-[1vw] py-[1vw] border-[0.3vw] text-white rounded-[0.6vw] border-white cursor-pointer hover:color-bg-subbold hover:text-white hover:color-border-subbold"
                            onClick={() => {
                                changeSettingRoomFlag();
                            }}
                        >
                            <p className="text-[1.4vw]">취소</p>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </section>
    );
}
