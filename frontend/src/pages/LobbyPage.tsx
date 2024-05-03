import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterRoom, roomList, roomMake } from '../api/rooms';
import { EnterRoomState, MakeRoomState, RoomInfo } from '../types/GameType';
import { httpStatusCode } from '../components/utils/http-status';
import { useDispatch, useSelector } from 'react-redux';
import { currentRoomState, roomIdState } from '../store/user-slice';
import StompClient from '../websocket/StompClient';

export default function LobbyPage() {
    const [makeRoomFlag, setMakeRoomFlag] = useState<boolean>(false);
    const [searchRoomFlag, setSearchRoomFlag] = useState<boolean>(false);
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
    const changeSearchRoomFlag = () => {
        setMakeRoomFlag(false);
        setSearchRoomFlag(!searchRoomFlag);
        setMakeRoomTitle('');
        setMakeRoomPassword('');
        setMakeRoomIsPublic(true);
        setPrivateRoomId('');
        setPrivateRoomPassword('');
        setPrivateRoomFlag(false);
    };
    const closePrivateRoom = () => {
        setPrivateRoomId('');
        setPrivateRoomPassword('');
        setPrivateRoomFlag(false);
    };

    const showRoomListAPI = async () => {
        const showRes = await roomList();
        if (showRes.status === httpStatusCode.OK) {
            console.log(showRes.data);
            setRoom(showRes.data.data);
        }
    };
    const makeRoomAPI = async () => {
        if (makeRoomTitle === '') {
            alert('방 제목을 1글자 이상 입력해주세요');
        } else {
            const makeRoomInfo: MakeRoomState = {
                roomTitle: makeRoomTitle,
                roomPassword: makeRoomPassword,
                isPublic: makeRoomIsPublic,
                roomAdmin: meName,
            };
            const makeRes = await roomMake(makeRoomInfo);
            console.log(makeRes);
            if (makeRes.status === httpStatusCode.CREATE) {
                console.log('만들어졌습니다.', makeRes.data.data.roomId);
                setRoomId(makeRes.data.data.roomId);
                dispatch(roomIdState(makeRes.data.data.roomId));
                stompClient.connect(makeRes.data.data.roomId, setWebsocketFlag);
                console.log(websocketFlag);
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
        const res = await enterRoom(checkData);
        console.log(res);
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
        const checkData: EnterRoomState = {
            roomId: privateRoomId,
            roomPassword: privateRoomPassword,
            nickname: meName,
        };
        const res = await enterRoom(checkData);
        console.log('비번데이터', checkData);
        console.log(res);
        if (res.status === httpStatusCode.OK) {
            setRoomId(privateRoomId);
            dispatch(roomIdState(privateRoomId));
            stompClient.connect(privateRoomId, setWebsocketFlag);
        }
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
        console.log('Lobby 시작', meName);
        showRoomListAPI();
        const interval = setInterval(() => {
            console.log('방 조회'); // value의 현재 값인 vaule.current를 가져오도록 한다.
            setCount((prev) => prev + 1);
            value.current++; // value.current에 1씩 더한다.
            showRoomListAPI();
            if (!window.location.pathname.includes('lobby')) {
                clearInterval(interval);
            }
        }, 5000);

        return () => {
            console.log('방 조회 제거');
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        console.log(websocketFlag);
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
                backgroundImage:
                    'url(/src/assets/images/bg/background-main.png)',
            }}
        >
            <div className="relative w-[80%] h-[90%] flex justify-between border-[0.3vw] rounded-[0.6vw] border-gray-950 bg-white overflow-y-auto">
                <div className="w-[15%]">
                    <p className="w-[80%] mx-auto my-[1vw] px-[1vw] py-[1.2vw] text-[1.2vw] border-[0.2vw] border-gray-950 rounded-[0.6vw] hover:color-bg-main cursor-pointer">
                        빠른시작
                    </p>
                    <p
                        className="w-[80%] mx-auto my-[1vw] px-[1vw] py-[1.2vw] text-[1.2vw] border-[0.2vw] border-gray-950 rounded-[0.6vw] hover:color-bg-main cursor-pointer"
                        onClick={() => {
                            changeMakeRoomFlag();
                        }}
                    >
                        방 만들기
                    </p>
                    <p
                        className="w-[80%] mx-auto my-[1vw] px-[1vw] py-[1.2vw] text-[1.2vw] border-[0.2vw] border-gray-950 rounded-[0.6vw] hover:color-bg-main cursor-pointer"
                        onClick={() => {
                            changeSearchRoomFlag();
                        }}
                    >
                        방 찾기
                    </p>
                </div>
                <div className="w-[85%] h-full flex flex-wrap content-start overflow-y-auto">
                    {room.map((item, index) => {
                        if (item.isPublic) {
                            return (
                                <div
                                    key={'public-room-' + index}
                                    className="w-[45%] h-[20%] px-[1vw] my-[0.6vw] mx-[0.4vw] flex justify-between items-center border-[0.3vw] rounded-[0.6vw] border-black bg-white cursor-pointer hover:bg-sky-500 "
                                    onClick={() => {
                                        checkPublicRoom(item.roomId);
                                    }}
                                >
                                    <div className="text-[1.8vw] flex items-center">
                                        <p>
                                            {index}.{item.roomTitle}
                                        </p>
                                        {item.isPublic ? (
                                            <p className="mx-[1vw] text-[1vw]">
                                                공개
                                            </p>
                                        ) : (
                                            <p className="mx-[1vw] text-[1vw]">
                                                비공개
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[1.6vw]">
                                            {item.roomPlayers.length}/6
                                        </p>
                                        {item.roomState === 0 ? (
                                            <p className="text-[1.6vw] text-sky-400">
                                                대기중
                                            </p>
                                        ) : (
                                            <p className="text-[1.6vw] text-red-600">
                                                게임중
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={'public-room-' + index}
                                    className="w-[45%] h-[20%] px-[1vw] my-[0.6vw] mx-[0.4vw] flex justify-between items-center border-[0.3vw] rounded-[0.6vw] border-black bg-white cursor-pointer hover:bg-sky-500 "
                                    onClick={() => {
                                        checkPrivateRoom(item.roomId);
                                    }}
                                >
                                    <div className="text-[1.8vw] flex items-center">
                                        <p>
                                            {index}.{item.roomTitle}
                                        </p>
                                        <p className="mx-[1vw] text-[1vw]">
                                            비공개
                                        </p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[1.6vw]">
                                            {item.roomPlayers.length}/6
                                        </p>
                                        <p className="text-[1.6vw] text-red-600">
                                            게임중
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
            {makeRoomFlag ? (
                <div className="absolute w-[40%] h-[40%] flex flex-col items-center justify-between border-[0.3vw] rounded-[0.6vw] border-gray-950 bg-white overflow-y-auto">
                    <div className="w-full flex flex-col items-center">
                        <p className="text-[1.8vw] my-[1vw]">방 만들기</p>
                        <div className="relative w-[90%] flex justify-start items-center my-[0.4vw]">
                            <p className="w-[40%] text-[1.6vw]">방 이름 : </p>
                            <input
                                className="w-[60%] border-[0.2vw] border-black px-[1vw] py-[0.4vw] mx-[1vw]"
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
                                className="w-[60%] border-[0.2vw] border-black px-[1vw] py-[0.4vw] mx-[1vw]"
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
                                className={`w-[1.4vw] h-[1.4vw] border-[0.2vw] mx-[0.4vw] color-border-main cursor-pointer ${
                                    makeRoomIsPublic ? '' : 'color-bg-main'
                                }`}
                                onClick={() => {
                                    setMakeRoomIsPublic(!makeRoomIsPublic);
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="relative w-[90%] flex justify-between items-center my-[1vw]">
                        <div
                            className="w-[30%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-black cursor-pointer hover:bg-sky-500 hover:text-white hover:border-sky-500"
                            onClick={() => {
                                makeRoom();
                            }}
                        >
                            <p className="text-[1.4vw]">방 만들기</p>
                        </div>
                        <div
                            className="w-[30%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-black cursor-pointer hover:bg-sky-500 hover:text-white hover:border-sky-500"
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
            {searchRoomFlag ? (
                <div className="absolute w-[40%] h-[40%] flex flex-col items-center justify-between border-[0.3vw] rounded-[0.6vw] border-gray-950 bg-white overflow-y-auto">
                    <p className="text-[1.8vw] my-[1vw]">방 찾기</p>
                    <div className="relative w-[90%] flex justify-start items-center my-[0.4vw]">
                        <p className="w-[40%] text-[1.6vw]">방 번호 : </p>
                        <input
                            className="w-[60%] border-[0.2vw] border-black px-[1vw] py-[0.4vw] mx-[1vw]"
                            type="text"
                            name=""
                            id=""
                        />
                    </div>

                    <div className="relative w-[90%] flex justify-between items-center my-[1vw]">
                        <p
                            className="w-[40%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-black cursor-pointer hover:bg-sky-500 hover:text-white hover:border-sky-500"
                            onClick={() => {
                                changeSearchRoomFlag();
                            }}
                        >
                            <p className="text-[1.4vw]">방 입장하기</p>
                        </p>
                        <p
                            className="w-[40%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-black cursor-pointer hover:bg-sky-500 hover:text-white hover:border-sky-500"
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
            )}
            {privateRoomFlag ? (
                <div className="absolute w-[40%] h-[40%] flex flex-col items-center justify-center border-[0.3vw] rounded-[0.6vw] border-gray-950 bg-white overflow-y-auto">
                    <p className="text-[2vw]">비밀번호입력</p>
                    <input
                        className="w-[80%] border-[0.2vw] border-black px-[1vw] py-[0.4vw] mx-[1vw]"
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
                            className="w-[40%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-black cursor-pointer hover:bg-sky-500 hover:text-white hover:border-sky-500"
                            onClick={() => {
                                checkPrivateRoomAPI();
                            }}
                        >
                            <p className="text-[1.4vw]">방 입장하기</p>
                        </p>
                        <p
                            className="w-[40%] h-full px-[1vw] py-[1vw] border-[0.3vw] rounded-[0.6vw] border-black cursor-pointer hover:bg-sky-500 hover:text-white hover:border-sky-500"
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
