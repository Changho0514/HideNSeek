import { RecoilRoot } from 'recoil';
import { Content } from '../components/content/Content';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentPlayersInfo } from '../types/GameType';
import { heartState } from '../store/user-slice';
import StompClient from '../websocket/StompClient';
import { startRecording, stopRecording, getStream, getInterval } from '../assets/js/voice';
import winnerSeeker from '../assets/images/icon/winner_seeker.png';
import winnerHider from '../assets/images/icon/winner_hider.png';
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

    const [seekerNum, setSeekerNum] = useState<number>(0);
    const [hiderNum, setHiderNum] = useState<number>(0);
    const [stream, setStream] = useState<any>();
    const [microphone, setMicrophone] = useState<any>();

    const [playing, setPlaying] = useState<boolean>(false);
    const [audio] = useState(new Audio('../src/assets/bgm/ingame_music.mp3'));
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
        if (currentRoom.roomState === 0) {
            audio.pause();
            document.exitPointerLock();
            navigate(`/room/${currentRoom.roomId}`, {
                state: currentRoom.roomId,
            });
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
        if (meInfo) {
            if (meInfo.isSeeker) {
                console.log('헤헤');
                dispatch(heartState(5));
            } else {
                dispatch(heartState(1));
            }
        }
    }, [meInfo.isSeeker]);
    useEffect(() => {
        if (meHeart === 0) {
            stompClient.sendMessage(
                `/player.dead`,
                JSON.stringify({
                    type: 'player.enter',
                    roomId: currentRoom.roomId,
                    sender: meInfo.nickname,
                    data: {
                        nickname: meInfo.nickname,
                        isDead: true,
                    },
                })
            );
        }
    }, [meHeart]);

    useEffect(() => {
        // 키보드(C, M) 이벤트 리스너 & voice.js의 stream과 interval값 갱신 & 페이지 이탈 시 이벤트리스너 삭제
        window.addEventListener('keydown', handleKeyPress);
        setInterval(() => {
            setStream(getStream())
            setMicrophone(getInterval())
        }, 500);

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue =
                '새로고침시 게임이 나가집니다. 페이지를 떠나시겠습니까?';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);

    // c나 m을 누르면 음성채널과 마이크 동작 실행
    const handleKeyPress = (event: KeyboardEvent) => {
        if(event.key == 'c'){
            if(!getStream()) {
                stompClient.enterVoiceChannel(
                    currentRoom.roomId,
                    meInfo.nickname
                );
            }else {
                stompClient.exitVoiceChannel();
            }
        }else if(event.key == 'm'){
            if(!getInterval()){
                startRecording();
            }else{
                stopRecording();
            }
        }
    };

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
            {currentRoom.roomState === 2 ? (
                <div className="absolute flex top-4 w-full justify-center">
                    <p className="text-[2vw]">
                        숨는 시간 : {currentRoom.roomTime}
                    </p>
                </div>
            ) : (
                <></>
            )}
            {currentRoom.roomState === 3 ? (
                <div className="absolute flex top-4 w-full justify-center">
                    <p className="text-[2vw]">
                        남은 시간 : {currentRoom.roomTime}
                    </p>
                </div>
            ) : (
                <></>
            )}
            {currentRoom.roomState === 4 ? (
                <div className="absolute flex flex-col items-center justify-center">
                    <img src={winnerSeeker} alt="" />
                    <p className="text-[2vw] text-black">
                        {currentRoom.roomTime}초 후 로비로 복귀합니다.
                    </p>
                </div>
            ) : (
                <></>
            )}
            {currentRoom.roomState === 5 ? (
                <div className="absolute flex flex-col items-center justify-center">
                    <img src={winnerHider} alt="" />
                    <p className="text-[2vw] text-black">
                        {currentRoom.roomTime}초 후 로비로 복귀합니다.
                    </p>
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
            <div className="absolute flex flex-col top-1 left-1 w-[25s%] h-[40%] bg-black bg-opacity-20 p-[0.4vw]">
                <div className="flex items-center">
                    <img className="px-[0.2vw]" src={keyW} alt="" />
                    <img className="px-[0.2vw]" src={keyA} alt="" />
                    <img className="px-[0.2vw]" src={keyS} alt="" />
                    <img className="px-[0.2vw]" src={keyD} alt="" />
                    <p className="px-[0.4vw] text-[1.6vw]">이동</p>
                </div>
                {meInfo.isSeeker ? (
                    <>
                        <div className="flex items-center my-[1vw]">
                            <img
                                className="px-[0.2vw]"
                                src={keyMouseleft}
                                alt=""
                            />
                            <p className="px-[0.4vw] text-[1.6vw]">공격</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center my-[1vw]">
                            <img
                                className="px-[0.2vw]"
                                src={keyQ}
                                alt=""
                            />
                            <img
                                className="px-[0.2vw]"
                                src={keyE}
                                alt=""
                            />
                            <p className="px-[0.4vw] text-[1.6vw]">회전 (좌, 우)</p>
                        </div>
                        <div className="flex items-center">
                            <img
                                className="px-[0.2vw]"
                                src={keyR}
                                alt="key_r.png"
                            />
                            <p className="px-[0.4vw] text-[1.6vw]">고정 / 해제</p>
                        </div>
                    </>
                )}

                {/* 음성채팅 입, 퇴장 관련 키 가이드 */}
                <div className="flex items-center my-[1vw]">
                    <img
                        className="px-[0.2vw]"
                        src={keyC}
                        alt="key_c.png"
                     />
                    <p className="px-[0.4vw] text-[1.6vw]">
                        {stream ? "음성채팅 퇴장" : "음성채팅 입장"}
                    </p>
                </div>

                {/* 마이크 ON, OFF 관련 키 가이드. 음성채팅에 들어와야 보인다 */}
                {stream ? (
                    <div className="flex items-center">
                        <img
                            className="px-[0.2vw]"
                            src={keyM}
                            alt="key_m.png"
                        />
                        <p className="px-[0.4vw] text-[1.6vw]">
                            {microphone ? "마이크 OFF" : "마이크 ON"}
                        </p>
                    </div>
                ): <></>}
            </div>
        </RecoilRoot>
    );
}
