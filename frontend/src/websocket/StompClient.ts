import { Client } from '@stomp/stompjs';
import { handshake } from './client';
import {
    addPeopleRoomState,
    currentRoomState,
    readyState,
    removePeopleRoomState,
    meDead,
    addChatDataState,
    channelIndexState,
    rerollState,
} from '../store/user-slice';
import { store } from '../store/store';
import {
    createStream,
    handleData,
    endStream,
    getStream,
} from '../assets/js/voice';

class StompClient {
    private static instance: StompClient;
    private client: Client | null = null;
    public isConnected = false;

    private constructor() {
        // private constructor to prevent direct instantiation.
    }

    public static getInstance(): StompClient {
        if (!StompClient.instance) {
            StompClient.instance = new StompClient();
        }
        return StompClient.instance;
    }

    public connect(
        roomId: string,
        setFlag: React.Dispatch<React.SetStateAction<boolean>>
    ): void {
        if (!this.client) {
            const channelIndex =
                store.getState().reduxFlag.userSlice.channelIndex;
            this.client = handshake(channelIndex);

            this.client.onConnect = () => {
                //public subscribe
                // console.log('소켓 연결.');
                setFlag(true);

                this.isConnected = true;
                if (this.client !== null) {
                    this.client.subscribe(`/sub/room/${roomId}`, (message) => {
                        const msg = JSON.parse(message.body);
                        // console.log(message.body);
                        switch (msg.type) {
                            case 'player.enter': {
                                // console.log('플레이어 입장', msg);
                                store.dispatch(addPeopleRoomState(msg.data));
                                break;
                            }
                            case 'player.exit': {
                                // console.log('플레이어 퇴장', msg);
                                store.dispatch(removePeopleRoomState(msg.data));
                                break;
                            }
                            case 'player.dead': {
                                // console.log(
                                //     '플레이어 사망 : ' + msg.data.nickname
                                // );
                                const {
                                    reduxFlag: { userSlice },
                                } = store.getState(); // userSlice만 추출
                                const meInfo = userSlice.meInfo;
                                if (meInfo.nickname === msg.data.nickname) {
                                    store.dispatch(meDead(true));
                                }

                                break;
                            }
                            case 'player.fix': {
                                // console.log('플레이어 고정', msg);
                                break;
                            }
                            /** 게임 입장 (요청 필요) */
                            case 'room.gameInit': {
                                // console.log('게임 입장', msg);
                                store.dispatch(readyState(true));
                                store.dispatch(currentRoomState(msg.data));
                                break;
                            }
                            case 'player.object': {
                                // console.log('물체 변경', msg);
                                break;
                            }
                            /** 플레이어 위치 정보 반환 */
                            case 'room.gameState': {
                                // console.log('위치 정보', msg);
                                store.dispatch(currentRoomState(msg.data));
                                break;
                            }
                            /** 숨기 시작 */
                            case 'room.hideStart': {
                                // console.log('숨기 시작', msg);
                                store.dispatch(currentRoomState(msg.data));
                                break;
                            }
                            case 'room.findStart': {
                                // console.log('찾기 시작', msg);
                                store.dispatch(currentRoomState(msg.data));
                                break;
                            }
                            case 'room.hiderWin': {
                                // console.log('숨는팀 승리', msg);
                                break;
                            }
                            case 'room.seekerWin': {
                                // console.log('찾는팀 승리', msg);
                                break;
                            }
                            case 'room.changeAdmin': {
                                // console.log('방장 위임', msg);
                                break;
                            }
                            case 'room.modify': {
                                // console.log('방 수정', msg);
                                break;
                            }
                            case 'room.backRoom': {
                                // console.log('대기실로 이동', msg);
                                store.dispatch(currentRoomState(msg.data));
                                this.exitVoiceChannel();
                                break;
                            }
                            case 'chat.player': {
                                // console.log('채팅', msg);
                                store.dispatch(addChatDataState(msg.data));
                                break;
                            }
                            // case 'room.rerollStart': {
                            //     console.log('리롤시작', msg);
                            //     store.dispatch(rerollState(1));
                            //     break;
                            // }
                            // case 'room.rerollEnd': {
                            //     console.log('리롤끝', msg);
                            //     store.dispatch(rerollState(2));
                            //     break;
                            // }

                            default: {
                                // console.log('여분의 msg', msg);
                                break;
                            }
                        }
                    });
                }
            };
            this.client.activate();
        } else if (this.client) {
            // console.log('소켓이 이미있음');
            setFlag(true);
            this.client.subscribe(`/sub/room/${roomId}`, (message) => {
                const msg = JSON.parse(message.body);
                switch (msg.type) {
                    case 'player.enter': {
                        // console.log('플레이어 입장', msg);
                        store.dispatch(addPeopleRoomState(msg.data));
                        break;
                    }
                    case 'player.exit': {
                        // console.log('플레이어 퇴장', msg);
                        store.dispatch(removePeopleRoomState(msg.data));
                        break;
                    }
                    case 'player.dead': {
                        // console.log('플레이어 사망 : ' + msg.data.nickname);
                        const {
                            reduxFlag: { userSlice },
                        } = store.getState(); // userSlice만 추출
                        const meInfo = userSlice.meInfo;
                        if (meInfo.nickname === msg.data.nickname) {
                            store.dispatch(meDead(true));
                        }

                        break;
                    }
                    /** 게임 입장 (요청 필요) */
                    case 'room.gameInit': {
                        // console.log('게임 입장', msg);
                        store.dispatch(readyState(true));
                        store.dispatch(currentRoomState(msg.data));
                        break;
                    }
                    case 'player.object': {
                        // console.log('물체 변경', msg);
                        break;
                    }
                    case 'player.fix': {
                        // console.log('플레이어 고정', msg);
                        break;
                    }
                    /** 플레이어 위치 정보 반환 */
                    case 'room.gameState': {
                        // console.log('위치 반환');
                        // console.log(msg);
                        store.dispatch(currentRoomState(msg.data));
                        break;
                    }
                    /** 숨기 시작 */
                    case 'room.hideStart': {
                        // console.log('숨기 시작', msg);
                        store.dispatch(currentRoomState(msg.data));
                        break;
                    }
                    case 'room.findStart': {
                        // console.log('찾기 시작', msg);
                        store.dispatch(currentRoomState(msg.data));
                        break;
                    }
                    case 'room.hiderWin': {
                        // console.log('숨는팀 승리', msg);
                        break;
                    }
                    case 'room.seekerWin': {
                        // console.log('찾는팀 승리', msg);
                        break;
                    }
                    case 'room.changeAdmin': {
                        // console.log('방장 위임', msg);
                        break;
                    }
                    case 'room.backRoom': {
                        // console.log('대기실로 이동', msg);
                        store.dispatch(currentRoomState(msg.data));
                        this.exitVoiceChannel();
                        break;
                    }
                    case 'room.modify': {
                        // console.log('방 수정', msg);
                        break;
                    }
                    case 'chat.player': {
                        // console.log('채팅', msg);
                        store.dispatch(addChatDataState(msg.data));
                        break;
                    }
                    // case 'room.rerollStart': {
                    //     console.log('리롤시작', msg);
                    //     store.dispatch(rerollState(1));
                    //     break;
                    // }
                    // case 'room.rerollEnd': {
                    //     console.log('리롤끝', msg);
                    //     store.dispatch(rerollState(2));
                    //     break;
                    // }
                }
            });
        }
    }

    public disconnect(): void {
        if (this.client) {
            this.client.deactivate();
        }
    }

    public sendMessage(destination: string, body: string): void {
        if (this.client && this.client.connected) {
            this.client.publish({ destination: destination, body: body });
        }
    }

    private subscribeId = Math.round(Math.random() * 10000) + '';

    public enterVoiceChannel(roomId: string, nickname: string): void {
        if (!this.client) {
            alert('연결된 소켓이 없습니다');
            return;
        }

        if (getStream()) return;

        createStream(roomId, nickname);

        this.client.subscribe(
            `/sub/voice/${roomId}`,
            (message) => {
                const stompPayload = JSON.parse(message.body);
                handleData(stompPayload);
            },
            { id: this.subscribeId }
        );
    }

    public exitVoiceChannel(): void {
        if (!this.client) return;
        if (!getStream()) return;

        this.client.unsubscribe(this.subscribeId);
        endStream();
    }
}

export default StompClient;
