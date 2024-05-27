/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterRoom, roomList, roomMake } from '../api/rooms';
import { EnterRoomState, MakeRoomState, RoomInfo } from '../types/GameType';
import { httpStatusCode } from '../components/utils/http-status';
import { useDispatch, useSelector } from 'react-redux';
import { currentRoomState, roomIdState } from '../store/user-slice';
import StompClient from '../websocket/StompClient';
import backgroundImage from '../assets/images/bg/background-main.png';
import RichMap from '../assets/images/bg/map-Rich.png';
import farmMap from '../assets/images/bg/map-Farm.png';
import textWait from '../assets/images/text/text_lobby_wait.png';
import textGame from '../assets/images/text/text_lobby_game.png';
import iconLock from '../assets/images/icon/icon_lobby_lock.png';

export default function LobbyPage() {
    const [makeRoomFlag, setMakeRoomFlag] = useState<boolean>(false);
    const [, setSearchRoomFlag] = useState<boolean>(false);
    const [privateRoomFlag, setPrivateRoomFlag] = useState<boolean>(false);
    const [privateRoomId, setPrivateRoomId] = useState<string>('');
    const [privateRoomPassword, setPrivateRoomPassword] = useState<string>('');
    const [makeRoomTitle, setMakeRoomTitle] = useState<string>('');
    const [makeRoomPassword, setMakeRoomPassword] = useState<string>('');
    const [makeRoomIsPublic, setMakeRoomIsPublic] = useState<boolean>(true);
    const [room, setRoom] = useState<RoomInfo[]>([]);
    const [roomId, setRoomId] = useState<string>('');
    const dispatch = useDispatch();
    const [websocketFlag, setWebsocketFlag] = useState<boolean>(false);
    const stompClient = StompClient.getInstance();

    const meName = useSelector(
        (state: any) => state.reduxFlag.userSlice.userNickname
    );
    const channelIndex = useSelector(
        (state: any) => state.reduxFlag.userSlice.channelIndex
    );

    const navigate = useNavigate();
    // const [room,setRoom] = useState<>();

    const changeMakeRoomFlag = () => {
        setMakeRoomFlag(!makeRoomFlag);
        setSearchRoomFlag(false);
        setMakeRoomTitle('');
        setMakeRoomPassword('');
        setMakeRoomIsPublic(true);
        setPrivateRoomId('');
        setPrivateRoomPassword('');
        setPrivateRoomFlag(false);
    };
    // const changeSearchRoomFlag = () => {
    //     setMakeRoomFlag(false);
    //     setSearchRoomFlag(!searchRoomFlag);
    //     setMakeRoomTitle('');
    //     setMakeRoomPassword('');
    //     setMakeRoomIsPublic(true);
    //     setPrivateRoomId('');
    //     setPrivateRoomPassword('');
    //     setPrivateRoomFlag(false);
    // };
    const closePrivateRoom = () => {
        setPrivateRoomId('');
        setPrivateRoomPassword('');
        setPrivateRoomFlag(false);
    };

    const showRoomListAPI = async () => {
        const showRes = await roomList(channelIndex);
        if (showRes.status === httpStatusCode.OK) {
            // console.log(showRes.data);
            setRoom(showRes.data.data);
        }
    };
    const makeRoomAPI = async () => {
        if (makeRoomTitle === '') {
            alert('방 제목을 1글자 이상 입력해주세요');
        } else if (makeRoomPassword !== '' && makeRoomIsPublic) {
            alert('비밀방 설정을 해주세요.');
        } else {
            const makeRoomInfo: MakeRoomState = {
                roomTitle: makeRoomTitle,
                roomPassword: makeRoomPassword,
                isPublic: makeRoomIsPublic,
                roomAdmin: meName,
            };
            const makeRes = await roomMake(makeRoomInfo, channelIndex);
            // console.log(makeRes);
            if (makeRes.status === httpStatusCode.CREATE) {
                // console.log('만들어졌습니다.', makeRes.data.data.roomId);
                setRoomId(makeRes.data.data.roomId);
                dispatch(roomIdState(makeRes.data.data.roomId));
                stompClient.connect(makeRes.data.data.roomId, setWebsocketFlag);
                // console.log(websocketFlag);
                showRoomListAPI();
            }
            changeMakeRoomFlag();
        }
    };
    const makeRoom = () => {
        makeRoomAPI();
    };
    const checkPublicRoom = async (id: string) => {
        const checkData: EnterRoomState = { roomId: id, nickname: meName };
        const res = await enterRoom(checkData, channelIndex);
        // console.log(res);
        if (res.status === httpStatusCode.OK) {
            setRoomId(id);
            dispatch(roomIdState(id));
            stompClient.connect(id, setWebsocketFlag);
        }
    };
    const checkPrivateRoom = (id: string) => {
        setPrivateRoomId(id);
        setPrivateRoomFlag(true);
    };
    const checkPrivateRoomAPI = async () => {
        // console.log(privateRoomPassword);
        const checkData: EnterRoomState = {
            roomId: privateRoomId,
            roomPassword: privateRoomPassword,
            nickname: meName,
        };
        const res = await enterRoom(checkData, channelIndex);
        // console.log('비번데이터', checkData);
        // console.log(res);
        if (res.status === httpStatusCode.OK) {
            setRoomId(privateRoomId);
            dispatch(roomIdState(privateRoomId));
            stompClient.connect(privateRoomId, setWebsocketFlag);
        }
    };
    const goChannel = () => {
        navigate('/selectchannel');
    };

    /** 일정 시간마다 방 조회 */
    const [, setCount] = useState(0);
    const value = useRef(0);

    useEffect(() => {
        dispatch(roomIdState(''));
        dispatch(
            currentRoomState({
                isPublic: true,
                roomId: '',
                roomMap: null,
                roomPassword: '',
                roomPlayers: [],
                roomState: null,
                roomTime: null,
                roomTitle: '',
            })
        );
        // console.log('Lobby 시작', meName);
        showRoomListAPI();
        const interval = setInterval(() => {
            // console.log('방 조회'); // value의 현재 값인 vaule.current를 가져오도록 한다.
            setCount((prev) => prev + 1);
            value.current++; // value.current에 1씩 더한다.
            showRoomListAPI();
            if (!window.location.pathname.includes('lobby')) {
                clearInterval(interval);
            }
        }, 1000);

        return () => {
            // console.log('방 조회 제거');
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        // console.log(websocketFlag);
        if (websocketFlag) {
            stompClient.sendMessage(
                `/player.enter`,
                JSON.stringify({
                    type: 'player.enter',
                    roomId: roomId,
                    sender: meName,
                    data: {
                        nickname: meName,
                    },
                })
            );
            navigate(`/room/${roomId}`, { state: roomId });
        }
    }, [websocketFlag]);
    return (
        <section
            className="relative w-full h-full flex flex-col items-center justify-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <div className="relative w-[80%] h-[90%] flex justify-between border-[0.3vw] rounded-[0.6vw] border-white color-bg-sublight overflow-y-auto">
                <div className="w-[15%]">
                    {/* <p className="w-[80%] mx-auto my-[1vw] px-[1vw] py-[1.2vw] text-[1.2vw] border-[0.2vw] border-white color-bg-main text-white rounded-[0.6vw] hover:color-bg-subbold cursor-pointer">
                        빠른시작
                    </p> */}
                    <p
                        className="w-[80%] mx-auto my-[1vw] px-[0.6vw] py-[1.2vw] text-[1.1vw] border-[0.2vw] border-white color-bg-main text-white rounded-[0.6vw] hover:color-bg-subbold cursor-pointer"
                        onClick={() => {
                            goChannel();
                        }}
                    >
                        ← 채널선택
                    </p>
                    <p
                        className="w-[80%] mx-auto my-[1vw] px-[1vw] py-[1.2vw] text-[1.1vw] border-[0.2vw] border-white color-bg-main text-white rounded-[0.6vw] hover:color-bg-subbold cursor-pointer"
                        onClick={() => {
                            changeMakeRoomFlag();
                        }}
                    >
                        방 만들기
                    </p>
                    {/* <p
                        className="w-[80%] mx-auto my-[1vw] px-[1vw] py-[1.2vw] text-[1.2vw] border-[0.2vw] border-white color-bg-main text-white rounded-[0.6vw] hover:color-bg-subbold cursor-pointer"
                        onClick={() => {
                            changeSearchRoomFlag();
                        }}
                    >
                        방 찾기
                    </p> */}
                </div>
                <div className="w-[85%] h-full flex flex-wrap content-start overflow-y-auto">
                    {room.map((item, index) => {
                        if (item.isPublic) {
                            return (
                                <div
                                    key={'public-room-' + index}
                                    className="w-[45%] h-[25%] px-[1vw] my-[0.6vw] mx-[0.4vw] flex justify-between items-center border-[0.3vw] rounded-[0.6vw] border-white color-bg-main text-white cursor-pointer hover:color-bg-subbold "
                                    onClick={() => {
                                        checkPublicRoom(item.roomId);
                                    }}
                                >
                                    <div className="w-[25%] h-[70%] bg-white rounded-[1vw]">
                                        <img
                                            className="w-full h-full"
                                            src={RichMap}
                                        ></img>
                                    </div>
                                    <div className="w-[70%] h-[70%] mx-[1vw] flex flex-col justify-between">
                                        <div className="bg-white color-text-black rounded-[0.6vw] px-[0.4vw] py-[0.4vw]">
                                            <div className="text-[1.3vw] flex items-center justify-between ">
                                                <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                                                    {index + 1}.{item.roomTitle}
                                                </p>
                                                {item.isPublic ? (
                                                    <></>
                                                ) : (
                                                    <img
                                                        className="w-[10%]"
                                                        src={iconLock}
                                                        alt=""
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            {item.roomState === 0 ? (
                                                <img
                                                    src={textWait}
                                                    className="w-[30%]"
                                                    alt=""
                                                />
                                            ) : (
                                                <img
                                                    src={textGame}
                                                    className="w-[35%]"
                                                    alt=""
                                                />
                                            )}
                                            <p className="text-[1.6vw] color-text-black">
                                                {item.roomPlayers.length}/12
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={'public-room-' + index}
                                    className="w-[45%] h-[25%] px-[1vw] my-[0.6vw] mx-[0.4vw] flex justify-between items-center border-[0.3vw] rounded-[0.6vw] border-white color-bg-main text-white cursor-pointer hover:color-bg-subbold "
                                    onClick={() => {
                                        checkPrivateRoom(item.roomId);
                                    }}
                                >
                                    <div className="w-[25%] h-[70%] bg-white rounded-[1vw]">
                                        <img
                                            className="w-full h-full"
                                            src={RichMap}
                                        ></img>
                                    </div>
                                    <div className="w-[70%] h-[70%] mx-[1vw] flex flex-col justify-between">
                                        <div className="bg-white color-text-black rounded-[0.6vw] px-[0.4vw] py-[0.4vw]">
                                            <div className="text-[1.5vw] flex items-center justify-between">
                                                <p>
                                                    {index + 1}.{item.roomTitle}
                                                </p>
                                                {item.isPublic ? (
                                                    <></>
                                                ) : (
                                                    <img
                                                        className="w-[10%]"
                                                        src={iconLock}
                                                        alt=""
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            {item.roomState === 0 ? (
                                                <img
                                                    src={textWait}
                                                    className="w-[30%]"
                                                    alt=""
                                                />
                                            ) : (
                                                <img
                                                    src={textGame}
                                                    className="w-[35%]"
                                                    alt=""
                                                />
                                            )}
                                            <p className="text-[1.6vw] color-text-black">
                                                {item.roomPlayers.length}/12
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
            {makeRoomFlag ? (
                <div className="absolute w-[40%]  flex flex-col items-center justify-between border-[0.3vw] rounded-[0.6vw] border-white color-bg-main text-white overflow-y-auto">
                    <div className="w-full flex flex-col items-center">
                        <p className="text-[1.8vw] my-[1vw]">방 만들기</p>
                        <div className="relative w-[90%] flex justify-start items-center my-[0.4vw]">
                            <p className="w-[40%] text-[1.6vw]">방 이름 : </p>
                            <input
                                className="w-[60%] border-[0.2vw] border-white text-black px-[1vw] py-[0.4vw] mx-[1vw]"
                                type="text"
                                name=""
                                id=""
                                value={makeRoomTitle}
                                onChange={(e) => {
                                    setMakeRoomTitle(e.target.value);
                                }}
                            />
                        </div>
                        <div className="relative w-[90%] flex justify-start items-center my-[0.4vw]">
                            <p className="w-[40%] text-[1.6vw]">
                                방 비밀번호 :{' '}
                            </p>
                            <input
                                className="w-[60%] border-[0.2vw] border-white text-black px-[1vw] py-[0.4vw] mx-[1vw]"
                                type="password"
                                name=""
                                id=""
                                value={makeRoomPassword}
                                onChange={(e) => {
                                    setMakeRoomPassword(e.target.value);
                                }}
                            />
                        </div>
                        <div className="w-[90%] flex justify-end items-center">
                            <p>비밀방</p>
                            <div
                                className={`w-[1.4vw] h-[1.4vw] border-[0.2vw] mx-[0.4vw] color-border-main bg-white cursor-pointer ${
                                    makeRoomIsPublic ? '' : 'color-bg-subbold'
                                }`}
                                onClick={() => {
                                    setMakeRoomIsPublic(!makeRoomIsPublic);
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="relative w-[90%] flex justify-between items-center my-[1vw]">
                        <div
                            className="w-[30%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-white cursor-pointer hover:color-bg-subbold hover:text-white hover:color-border-subbold"
                            onClick={() => {
                                makeRoom();
                            }}
                        >
                            <p className="text-[1.4vw]">방 만들기</p>
                        </div>
                        <div
                            className="w-[30%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-white cursor-pointer hover:color-bg-subbold hover:text-white hover:color-border-subbold"
                            onClick={() => {
                                changeMakeRoomFlag();
                            }}
                        >
                            <p className="text-[1.4vw]">취소</p>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
            {/* {searchRoomFlag ? (
                <div className="absolute w-[40%] h-[40%] flex flex-col items-center justify-between border-[0.3vw] rounded-[0.6vw] border-gray-950 bg-white overflow-y-auto">
                    <p className="text-[1.8vw] my-[1vw]">방 찾기</p>
                    <div className="relative w-[90%] flex justify-start items-center my-[0.4vw]">
                        <p className="w-[40%] text-[1.6vw]">방 번호 : </p>
                        <input
                            className="w-[60%] border-[0.2vw] color-border-subbold px-[1vw] py-[0.4vw] mx-[1vw]"
                            type="text"
                            name=""
                            id=""
                        />
                    </div>

                    <div className="relative w-[90%] flex justify-between items-center my-[1vw]">
                        <p
                            className="w-[40%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] color-border-subbold cursor-pointer hover:color-bg-subbold hover:text-white hover:color-border-subbold"
                            onClick={() => {
                                changeSearchRoomFlag();
                            }}
                        >
                            <p className="text-[1.4vw]">방 입장하기</p>
                        </p>
                        <p
                            className="w-[40%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] color-border-subbold cursor-pointer hover:color-bg-subbold hover:text-white hover:color-border-subbold"
                            onClick={() => {
                                changeSearchRoomFlag();
                            }}
                        >
                            <p className="text-[1.4vw]">취소하기</p>
                        </p>
                    </div>
                </div>
            ) : (
                <></>
            )} */}
            {privateRoomFlag ? (
                <div className="absolute w-[40%] h-[40%] flex flex-col items-center justify-around border-[0.3vw] rounded-[0.6vw] border-white color-bg-main text-white overflow-y-auto">
                    <p className="text-[2vw]">비밀번호입력</p>
                    <input
                        className="w-[80%] border-[0.2vw] color-text-black color-border-subbold px-[1vw] py-[0.4vw] mx-[1vw]"
                        type="password"
                        name=""
                        id=""
                        value={privateRoomPassword}
                        onChange={(e) => {
                            setPrivateRoomPassword(e.target.value);
                        }}
                    />
                    <div className="relative w-[90%] flex justify-between items-center my-[1vw]">
                        <p
                            className="w-[40%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-white cursor-pointer hover:color-bg-subbold hover:text-white hover:color-border-subbold"
                            onClick={() => {
                                checkPrivateRoomAPI();
                            }}
                        >
                            <p className="text-[1.4vw]">방 입장하기</p>
                        </p>
                        <p
                            className="w-[40%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-white cursor-pointer hover:color-bg-subbold hover:text-white hover:color-border-subbold"
                            onClick={() => {
                                closePrivateRoom();
                            }}
                        >
                            <p className="text-[1.4vw]">취소하기</p>
                        </p>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </section>
    );
}
