import { RecoilRoot } from 'recoil';
import { Content } from '../components/content/Content';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatType, CurrentPlayersInfo, ThumbnailType } from '../types/GameType';
import {
    chatFlagState,
    heartState,
    observserModeState,
} from '../store/user-slice';
import { store } from '../store/store';
import StompClient from '../websocket/StompClient';
import {
    startRecording,
    stopRecording,
    getStream,
    getInterval,
} from '../assets/js/voice';
import winnerSeeker from '../assets/images/icon/winner_seeker.png';
import winnerHider from '../assets/images/icon/winner_hider.png';
import gameInit from '../assets/images/icon/round_start.png';
import keyA from '../assets/images/icon/key_a.png';
import keyD from '../assets/images/icon/key_d.png';
import keyE from '../assets/images/icon/key_e.png';
import keyMouseleft from '../assets/images/icon/key_mouseleft.png';
import keyQ from '../assets/images/icon/key_q.png';
import keyS from '../assets/images/icon/key_s.png';
import keyW from '../assets/images/icon/key_w.png';
import keyC from '../assets/images/icon/key_c.png';
import keyM from '../assets/images/icon/key_m.png';
import keyR from '../assets/images/icon/key_r.png';
import keyEsc from '../assets/images/icon/key_esc.png';
import keyRight from '../assets/images/icon/key_arrowR.png';
import keyLeft from '../assets/images/icon/key_arrowL.png';
import keySpace from '../assets/images/icon/key_space.png';
import keyEnter from '../assets/images/icon/key_Enter.png';
import ingameMusic from '../assets/bgm/ingame_music.mp3';
import hurryUpMusic from '../assets/bgm/ingame_music_fast.mp3';
import RichRoomInfo from '../json/RichRoomInfo.json';
import FarmInfo from '../json/FarmInfo.json';

export default function GamePage() {
    const stompClient = StompClient.getInstance();
    const meInfo = useSelector(
        (state: any) => state.reduxFlag.userSlice.meInfo
    );

    const currentRoom = useSelector(
        (state: any) => state.reduxFlag.userSlice.currentRoom
    );
    const meHeart = useSelector(
        (state: any) => state.reduxFlag.userSlice.meHeart
    );
    const bgmSetting = useSelector(
        (state: any) => state.reduxFlag.userSlice.bgmFlag
    );

    const chatList = useSelector(
        (state: any) => state.reduxFlag.userSlice.chatData
    );

    const observerState = useSelector(
        (state: any) => state.reduxFlag.userSlice.observer
    );

    const isObserver = useSelector(
        (state: any) => state.reduxFlag.userSlice.observserMode
    );

    const [seekerNum, setSeekerNum] = useState<number>(0);
    const [hiderNum, setHiderNum] = useState<number>(0);
    const [stream, setStream] = useState<any>();
    const [microphone, setMicrophone] = useState<any>();

    const [playing, setPlaying] = useState<boolean>(false);
    const [audio, setAudio] = useState(new Audio(ingameMusic));

    const [toggleChat, setToggleChat] = useState<boolean>(false);
    const [roundStart, setRoundStart] = useState<boolean>(false);
    const [, setToggleSetting] = useState<boolean>(false);
    const [chatContent, setChatContent] = useState<string>('');
    const [thumbnailInfo, setThumbnailInfo] =
        useState<ThumbnailType[]>(RichRoomInfo);
    const [changeMusicFlag, setChangeMusicFlag] = useState<boolean>(false);
    //공격
    const [shot, setShot] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    //스크롤 탐지용
    const messageEndRef = useRef<HTMLDivElement>(null);
    // BGM 설정
    useEffect(() => {
        setPlaying(bgmSetting);
    }, [playing, bgmSetting]);
    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing, audio]);
    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, [audio]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (currentRoom.roomMap === 'richRoom') {
            setThumbnailInfo(RichRoomInfo);
        } else if (currentRoom.roomMap === 'farm') {
            setThumbnailInfo(FarmInfo);
        } else {
            setThumbnailInfo(RichRoomInfo);
        }
    }, [currentRoom.roomMap]);
    useEffect(() => {
        if (currentRoom.roomState === 0) {
            audio.pause();
            document.exitPointerLock();
            navigate(`/room/${currentRoom.roomId}`, {
                state: currentRoom.roomId,
            });
        } else if (currentRoom.roomState === 3 && !roundStart) {
            startRound();
        } else if (currentRoom.roomState === 1) {
            dispatch(observserModeState(true));
        }
    }, [currentRoom.roomState]);
    useEffect(() => {
        let seeker = 0;
        let hider = 0;
        currentRoom.roomPlayers.map((item: CurrentPlayersInfo) => {
            if (item.isSeeker && !item.isDead) {
                seeker++;
            } else if (!item.isSeeker && !item.isDead) {
                hider++;
            }
            setSeekerNum(seeker);
            setHiderNum(hider);
        });
    }, [currentRoom.roomPlayers]);
    useEffect(() => {
        if (
            currentRoom.roomState === 3 &&
            currentRoom.roomTime <= 30 &&
            !changeMusicFlag
        ) {
            setChangeMusicFlag(true);
        }
    }, [currentRoom.roomTime]);
    useEffect(() => {
        if (changeMusicFlag) {
            changeMusic(hurryUpMusic);
        }
    }, [changeMusicFlag]);
    useEffect(() => {
        if (meInfo) {
            if (meInfo.isSeeker) {
                dispatch(heartState(7));
            } else {
                dispatch(heartState(1));
            }
        }
    }, [meInfo.isSeeker]);
    useEffect(() => {
        if (meHeart < 7 && meHeart >= 0) {
            handleShot();
        }
        if (currentRoom.roomState === 3 && meHeart === 0) {
            stompClient.sendMessage(
                `/player.dead`,
                JSON.stringify({
                    type: 'player.dead',
                    roomId: currentRoom.roomId,
                    sender: meInfo.nickname,
                    data: {
                        nickname: meInfo.nickname,
                        isDead: true,
                    },
                })
            );
            const data = `술래 '${meInfo.nickname}' 님이 죽었습니다.`;
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
        }
    }, [meHeart]);

    useEffect(() => {
        dispatch(chatFlagState(toggleChat));
        if (toggleChat) {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } else {
            if (inputRef.current && chatContent !== '') {
                // console.log('보낼게염');
                stompClient.sendMessage(
                    `/chat.player`,
                    JSON.stringify({
                        type: 'chat.player',
                        roomId: currentRoom.roomId,
                        sender: meInfo.nickname,
                        data: {
                            nickname: meInfo.nickname,
                            content: chatContent,
                        },
                    })
                );
                setChatContent('');

                inputRef.current.blur();
            }
        }
    }, [toggleChat]);
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }, [chatList]);

    useEffect(() => {
        // 키보드(C, M) 이벤트 리스너 & voice.js의 stream과 interval값 갱신 & 페이지 이탈 시 이벤트리스너 삭제
        setInterval(() => {
            setStream(getStream());
            setMicrophone(getInterval());
        }, 300);

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue =
                '새로고침시 게임이 나가집니다. 페이지를 떠나시겠습니까?';
        };

        // c나 m을 누르면 음성채널과 마이크 동작 실행
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key == 'c' || event.key == 'C') {
                // if (!getStream()) {
                //     stompClient.enterVoiceChannel(
                //         currentRoom.roomId,
                //         meInfo.nickname
                //     );
                // } else {
                //     stompClient.exitVoiceChannel();
                // }
            } else if (event.key == 'm' || event.key == 'M') {
                // if (!getInterval()) {
                //     startRecording();
                // } else {
                //     stopRecording();
                // }
            } else if (event.key === 'Enter') {
                setToggleChat((prev) => !prev);
            } else if (event.key === 'Escape') {
                setToggleSetting((prev) => !prev);
                const element = document.body;
                const requestPointerLock = element.requestPointerLock;
                requestPointerLock.call(element);
            }
        };
        const onPointerLockChange = () => {
            if (document.pointerLockElement === null) {
                setToggleSetting(true);
                // console.log('Pointer has been unlocked.');
                // 포인터가 잠금 해제되었을 때 실행할 추가 로직
                // 예: 팝업 표시, 상태 업데이트 등
            } else {
                setToggleSetting(false);
            }
        };

        // 이벤트 리스너 추가
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('pointerlockchange', onPointerLockChange);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener(
                'pointerlockchange',
                onPointerLockChange
            );
        };
    }, []);

    const handleShot = () => {
        setShot(true);
        setTimeout(() => {
            setShot(false);
        }, 300); // 0.5초 후에 isRed 상태를 false로 변경
    };
    const startRound = () => {
        setRoundStart(true);
        setTimeout(() => {
            setRoundStart(false);
        }, 4000); // 0.5초 후에 isRed 상태를 false로 변경
    };
    const changeMusic = (newMusic: string) => {
        // 기존 Audio 객체 정리
        cleanupAudio(audio);

        // 새로운 Audio 객체 생성 및 설정
        setAudio(new Audio(newMusic));
    };

    const cleanupAudio = (audioInstance: HTMLAudioElement) => {
        if (audioInstance) {
            audioInstance.pause();
            audioInstance.src = '';
            audioInstance.load();
        }
    };
    // const closeSetting = () => {
    //     setToggleSetting(false);
    // };

    return (
        <RecoilRoot>
            <Content />
            {currentRoom.roomState === 1 ? (
                <div className="absolute flex top-4 w-full justify-center items-center text-[2vw]">
                    <p className=" text-sky-400">술래</p>
                    <p className=" text-sky-400 ms-[1vw]">{seekerNum}</p>
                    <p className="px-[2vw]">
                        대기 시간 : {currentRoom.roomTime}
                    </p>
                    <p className=" text-orange-400">도망자</p>
                    <p className=" text-orange-400 ms-[1vw]">{hiderNum}</p>
                </div>
            ) : (
                <></>
            )}

            {/* {currentRoom.roomState === 2 ? (
                <div className="absolute flex top-4 w-full justify-center items-center text-[2vw]">
                    <p className=" text-sky-400">술래</p>
                    <p className=" text-sky-400 ms-[1vw]">{seekerNum}</p>
                    <p className="text-[2vw] mx-[2vw]">
                        숨는 시간 : {currentRoom.roomTime}
                    </p>
                    <p className=" text-orange-400">도망자</p>
                    <p className=" text-orange-400 ms-[1vw]">{hiderNum}</p>
                </div>
            ) : (
                <></>
            )} */}
            {/* {currentRoom.roomState === 2 && meInfo.isSeeker ? (
                <div className="absolute w-full h-full flex flex-col justify-center items-center bg-black">
                    <div className="flex top-4 w-full justify-center items-center text-[2vw]">
                        <p className=" text-sky-400">술래</p>
                        <p className=" text-sky-400 ms-[1vw]">{seekerNum}</p>
                        <p className="text-[2vw] mx-[1vw] text-white">
                            숨는 시간 : {currentRoom.roomTime}
                        </p>
                        <p className=" text-orange-400">도망자</p>
                        <p className=" text-orange-400 ms-[1vw]">{hiderNum}</p>
                    </div>
                    <img
                        className="w-[80%] h-[70%]"
                        src={seekerDisplay}
                        alt=""
                    />
                    <p className="text-[3vw] text-white">
                        당신은 술래입니다. 조금만 기다려주시기 바랍니다.
                    </p>
                </div>
            ) : (
                <></>
            )} */}
            {currentRoom.roomState === 2 ? (
                <div className="absolute flex top-4 w-full justify-center items-center text-[2vw]">
                    <p className=" text-sky-400">술래</p>
                    <p className=" text-sky-400 ms-[1vw]">{seekerNum}</p>
                    <p className="text-[2vw] mx-[1vw]">
                        숨는 시간 : {currentRoom.roomTime}
                    </p>
                    <p className=" text-orange-400">도망자</p>
                    <p className=" text-orange-400 ms-[1vw]">{hiderNum}</p>
                </div>
            ) : (
                <></>
            )}
            {currentRoom.roomState === 3 ? (
                <div className="absolute flex top-4 w-full justify-center items-center text-[2vw]">
                    <p className=" text-sky-400">술래</p>
                    <p className=" text-sky-400 ms-[1vw]">{seekerNum}</p>
                    <p className="text-[2vw] mx-[2vw]">
                        남은 시간 : {currentRoom.roomTime}
                    </p>
                    <p className=" text-orange-400">도망자</p>
                    <p className=" text-orange-400 ms-[1vw]">{hiderNum}</p>
                </div>
            ) : (
                <></>
            )}
            {currentRoom.roomState === 4 ? (
                <div className="absolute flex flex-col items-center justify-center z-20">
                    <img src={winnerSeeker} alt="" />
                    <p className="text-[2vw] text-black">
                        {currentRoom.roomTime}초 후 로비로 복귀합니다.
                    </p>
                </div>
            ) : (
                <></>
            )}
            {currentRoom.roomState === 5 ? (
                <div className="absolute flex flex-col items-center justify-center z-20">
                    <img src={winnerHider} alt="" />
                    <p className="text-[2vw] text-black">
                        {currentRoom.roomTime}초 후 로비로 복귀합니다.
                    </p>
                </div>
            ) : (
                <></>
            )}
            {currentRoom.roomState === 4 || currentRoom.roomState === 5 ? (
                <div className="absolute w-full h-[28%] flex justify-center bottom-4">
                    {currentRoom.roomPlayers.map(
                        (item: CurrentPlayersInfo, pIndex: number) => {
                            if (!item.isSeeker) {
                                return (
                                    <div
                                        className="w-[12%] h-[full] flex flex-col items-center border-[0.4vw] color-border-main bg-white p-[0.6vw] rounded-[0.6vw] mx-[1vw] text-[1vw]"
                                        key={'result-' + pIndex}
                                    >
                                        <p className="w-full h-[15%] whitespace-nowrap overflow-hidden overflow-ellipsis">
                                            {item.nickname}
                                        </p>
                                        {item.selectedIndex ? (
                                            <img
                                                className="relative w-40 h-[70%] object-fill"
                                                src={
                                                    thumbnailInfo[
                                                        item.selectedIndex
                                                    ].thumbnail
                                                }
                                                alt=""
                                            />
                                        ) : (
                                            <></>
                                        )}
                                        {item.selectedIndex ? (
                                            <p className="h-[15%]">
                                                {
                                                    thumbnailInfo[
                                                        item.selectedIndex
                                                    ].name
                                                }
                                            </p>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                );
                            }
                        }
                    )}
                </div>
            ) : (
                <></>
            )}
            {meInfo.isSeeker ? (
                <div className="absolute flex left-1 bottom-1">
                    {Array.from({ length: meHeart }).map((_, i) => (
                        <p className="text-[2vw]" key={i}>
                            💖
                        </p>
                    ))}
                </div>
            ) : (
                <></>
            )}
            {!meInfo.isSeeker ? (
                <div className="absolute flex left-1 bottom-1">
                    <p className="text-[2vw]">💖</p>
                </div>
            ) : (
                <></>
            )}
            {meInfo.isSeeker ? (
                <div className="absolute w-full h-full flex justify-center items-center">
                    <p className="w-[10px] h-[10px] rounded-full bg-black"></p>
                </div>
            ) : (
                <></>
            )}
            <div className="absolute flex flex-col top-1 left-1 w-[25s%] h-auto bg-black bg-opacity-20 p-[0.4vw]">
                <div className="flex items-center">
                    <img className="w-[40px] px-[0.2vw]" src={keyW} alt="" />
                    <img className="w-[40px] px-[0.2vw]" src={keyA} alt="" />
                    <img className="w-[40px] px-[0.2vw]" src={keyS} alt="" />
                    <img className="w-[40px] px-[0.2vw]" src={keyD} alt="" />
                    <p className="px-[0.4vw] text-[1.4vw]">이동</p>
                </div>
                {meInfo.isSeeker ? (
                    <>
                        <div className="flex items-center my-[1vw]">
                            <img
                                className="w-[40px] px-[0.2vw]"
                                src={keyMouseleft}
                                alt=""
                            />
                            <p className="px-[0.4vw] text-[1.4vw]">공격</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center my-[1vw]">
                            <img
                                className="w-[40px] px-[0.2vw]"
                                src={keyQ}
                                alt=""
                            />
                            <img
                                className="w-[40px] px-[0.2vw]"
                                src={keyE}
                                alt=""
                            />
                            <p className="px-[0.4vw] text-[1.4vw]">
                                회전 (좌, 우)
                            </p>
                        </div>
                        <div className="flex items-center mb-[1vw]">
                            <img
                                className="w-[40px] px-[0.2vw]"
                                src={keyR}
                                alt="key_r.png"
                            />
                            <p className="px-[0.4vw] text-[1.4vw]">
                                고정 / 해제
                            </p>
                        </div>
                        {/* <div className="flex items-center mb-[1vw]">
                            <img className="px-[0.2vw]" src={keyLeft} alt="" />
                            <img className="px-[0.2vw]" src={keyRight} alt="" />
                            <p className="px-[0.4vw] text-[1.6vw]">
                                관전 (고정시에만)
                            </p>
                        </div> */}
                    </>
                )}

                <div className="flex items-center mb-[1vw]">
                    <img
                        className="w-[80px] px-[0.2vw]"
                        src={keySpace}
                        alt="key_space.png"
                    />
                    <p className="px-[0.4vw] text-[1.4vw]">점프</p>
                </div>
                <div className="flex items-center mb-[1vw]">
                    <img
                        className="w-[40px] px-[0.2vw]"
                        src={keyEsc}
                        alt="key_esc.png"
                    />
                    <p className="px-[0.4vw] text-[1.4vw]">마우스 고정 해제</p>
                </div>
                <div className="flex items-center mb-[1vw]">
                    <img
                        className="w-[80px] px-[0.2vw]"
                        src={keyEnter}
                        alt="key_enter.png"
                    />
                    <p className="px-[0.4vw] text-[1.4vw]">채팅</p>
                </div>

                {/* 음성채팅 입, 퇴장 관련 키 가이드 */}
                {/* <div className="flex items-center">
                    <img
                        className="w-[40px] px-[0.2vw]"
                        src={keyC}
                        alt="key_c.png"
                    />
                    <p className="px-[0.4vw] text-[1.4vw]">
                        {stream ? '음성채팅 퇴장' : '음성채팅 입장'}
                    </p>
                </div> */}

                {/* 마이크 ON, OFF 관련 키 가이드. 음성채팅에 들어와야 보인다 */}
                {/* {stream ? (
                    <div className="flex items-center">
                        <img
                            className="w-[40px] px-[0.2vw]"
                            src={keyM}
                            alt="key_m.png"
                        />
                        <p className="px-[0.4vw] text-[1.4vw]">
                            {microphone ? '마이크 OFF' : '마이크 ON'}
                        </p>
                    </div>
                ) : (
                    <></>
                )} */}
            </div>
            <div
                className={
                    'absolute flex flex-col bottom-20 left-1 w-[30%] h-[30%]  p-[0.4vw] overflow-y-auto'
                }
                style={
                    toggleChat
                        ? { backgroundColor: 'rgba(0,0,0,0.1)', opacity: 10 }
                        : {}
                }
            >
                <div className="w-[full] h-[90%] p-[0.4vw] overflow-y-auto overflow-x-hidden text-[1.2vw]">
                    {chatList.map((item: ChatType, index: number) => {
                        if (item.nickname === '<SYSTEM>') {
                            return (
                                <div
                                    className="w-full flex justify-start my-1 text-red-500"
                                    key={'chat key : ' + index}
                                >
                                    <p className="w-[auto] max-w-[30%] whitespace-nowrap overflow-hidden overflow-ellipsis">
                                        {item.nickname} :
                                    </p>
                                    <p className="w-[auto] max-w-[70%] text-start ">
                                        {item.content}
                                    </p>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    className="w-full flex justify-start my-1"
                                    key={'chat key : ' + index}
                                >
                                    <p className="w-[auto] max-w-[25%] whitespace-nowrap overflow-hidden overflow-ellipsis">
                                        {item.nickname} :
                                    </p>
                                    <p className="w-[auto] max-w-[75%] text-start">
                                        {item.content}
                                    </p>
                                </div>
                            );
                        }
                    })}
                    <div ref={messageEndRef}></div>
                </div>
                <input
                    ref={inputRef}
                    className="w-[full] h-[10%] p-[0.4vw] overflow-auto"
                    value={chatContent}
                    onChange={(e) => {
                        setChatContent(e.target.value);
                    }}
                    style={
                        toggleChat
                            ? { visibility: 'visible' }
                            : { visibility: 'hidden' }
                    }
                />
            </div>

            {/* 숨는시간 술래 자막 */}
            {(currentRoom.roomState === 1 || currentRoom.roomState === 2) &&
            meInfo.isSeeker ? (
                <div className="absolute flex flex-col bottom-20 justify-center">
                    <p className="text-[2vw] text-black">
                        당신은 술래입니다. 사물팀이 숨는동안 맵을 외우세요!
                    </p>
                </div>
            ) : (
                <></>
            )}

            {/* 관전 중 자막 */}
            {!isObserver &&
            observerState &&
            !meInfo.isSeeker &&
            !meInfo.isDead &&
            (currentRoom.roomState === 2 || currentRoom.roomState === 3) ? (
                <div className="absolute flex flex-col bottom-20 justify-center">
                    <div className="flex justify-center items-center text-[2vw]">
                        <img className="px-[0.2vw]" src={keyLeft} alt="" />
                        <p className="mx-[2vw]">{observerState}</p>
                        <img className="px-[0.2vw]" src={keyRight} alt="" />
                    </div>
                </div>
            ) : (
                <></>
            )}

            {/* 관전 중 자막 */}
            {meInfo.isDead &&
            !meInfo.isSeeker &&
            currentRoom.roomState === 3 ? (
                <div className="absolute flex flex-col bottom-20 justify-center">
                    <div className="flex justify-center items-center text-[2vw]">
                        <p className="mx-[2vw]">당신은 술래에게 잡혔습니다!</p>
                    </div>
                </div>
            ) : (
                <></>
            )}

            {shot ? (
                <div className="absolute w-full h-full bg-red-400 opacity-35"></div>
            ) : (
                <></>
            )}
            {roundStart ? (
                <div className="absolute flex flex-col items-center justify-center">
                    <img src={gameInit} alt="" />
                    <p className="text-[2vw] text-black">
                        술래는 도망자를 찾으세요!
                    </p>
                </div>
            ) : (
                <></>
            )}
            {/* {toggleSetting ? (
                <div className="absolute w-[50%] h-[50%] bg-white rounded-[0.6vw] z-20">
                    <div className="relative w-full h-full  flex flex-col items-center justify-center ">
                        <p className="text-[2vw] text-black">환경설정입니다</p>
                        <div
                            className="absolute top-0 right-0 bg-slate-600 cursor-pointer"
                            onClick={closeSetting}
                        >
                            X
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )} */}
        </RecoilRoot>
    );
}
