/* eslint-disable @typescript-eslint/no-explicit-any */
import Stomp from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';

let stompClient: Stomp.Client;
let url = `${import.meta.env.VITE_REACT_WEBSOCKET_URL}`
export const handshake = (channelIndex: any) => {
    if(`${import.meta.env.VITE_REACT_WEBSOCKET_URL}`.includes("hidebowwow")){
        url = `${import.meta.env.VITE_REACT_WEBSOCKET_URL}` + "/ch/" + channelIndex;
    }
  stompClient = new Client({
    brokerURL: url + "/ws",
    // debug: function (str: any) {
    //   console.log(str);
    // },
    reconnectDelay: 5000,
  });

  return stompClient;
};