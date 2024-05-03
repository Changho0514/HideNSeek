import Stomp from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';

let stompClient: Stomp.Client;

export const handshake = () => {
    stompClient = new Client({
        brokerURL: `${import.meta.env.VITE_REACT_WEBSOCKET_URL}`,
        // debug: function (str: any) {
        //     console.log(str);
        // },
        reconnectDelay: 5000,
    });

    return stompClient;
};
