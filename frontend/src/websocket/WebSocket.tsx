import { Client } from '@stomp/stompjs';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { handshake } from './client';

interface Prop {
    setWebSocketClient: Dispatch<SetStateAction<Client>>;
    client: Client;
    roomId: string;
    webSocketId?: string;
}

/** 웹소켓 핸드쉐이크 및 수신 정보 처리 담당(채팅 제외)*/
export default function WebSocket(props: Prop) {
    //websocket
    //websocketId 받아오기 -> handshake
    useEffect(() => {
        const client = handshake("1");
        // console.log('websocketId : ' + id);
        client.onConnect = () => {
            //public subscribe
            client.subscribe(`/sub/room/${props.roomId}`, (message) => {
                console.log(message);
                const msg = JSON.parse(message.body);
                switch (msg.type) {
                    case 'player.enter': {
                        console.log(msg);
                        break;
                    }
                    case 'room.gameState': {
                        console.log(msg);
                        break;
                    }
                    case 'room.gameStart': {
                        console.log(msg);
                        break;
                    }
                    case 'room.gameInit': {
                        console.log(msg);
                        break;
                    }
                    case 'room.finish': {
                        console.log(msg);
                        break;
                    }
                    case 'room.backRoom': {
                        console.log(msg);
                        break;
                    }
                }
            });
            props.setWebSocketClient(client);
        };
        client.activate();
    }, []);

    //subscribe후 초기 정보 받아오기
    return <div className="hidden"></div>;
}
