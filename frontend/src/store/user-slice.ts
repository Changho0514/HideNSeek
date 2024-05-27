import { createSlice } from '@reduxjs/toolkit';
import {
    ChatType,
    CollideObject,
    CurrentPlayersInfo,
    MapSize,
    RoomInfo,
} from '../types/GameType';
import { Vector3 } from 'three'

export interface UserState {
    //닉네임
    userNickname: string;
    roomId: string;
    isReady: boolean;
    currentRoom: RoomInfo;
    meInfo: CurrentPlayersInfo;
    collideObj: CollideObject[];
    meHeart: number;
    bgmFlag: boolean;
    mapSize: MapSize;
    chatData: ChatType[];
    chatFlag: boolean;
    channelIndex: number;
    rerollTime: number; 
    observserMode: boolean;
    observer: string;
    cameraPosition: Vector3;
}
const initialState: UserState = {
    userNickname: '',
    roomId: '',
    isReady: false,
    currentRoom: {
        isPublic: true,
        roomId: '',
        roomAdmin: '',
        roomMap: null,
        roomPassword: '',
        roomPlayers: [],
        roomState: null,
        roomTime: null,
        roomTitle: '',
        botCnt: 0,
        mapValue: null,
    },
    meInfo: {
        nickname: '',
        selectedIndex: null,
        position: [0, 0, 0],
        direction: [0, 0, 0],
        isDead: null,
        isSeeker: null, 
    },
    collideObj: [],
    meHeart: 0,
    bgmFlag: true,
    mapSize: {
        minX: -100,
        maxX: 100,
        minZ: -100,
        maxZ: 100,
        minY: -1,
        maxY: 8,
    },
    chatData: [], 
    observer: '',
    observserMode: false, 
    chatFlag: false,
    channelIndex :1,
    rerollTime: 0,
    cameraPosition : new Vector3(0,0,0),
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        //닉네임 설정
        userNicknameState: (state, action) => {
            state.userNickname = action.payload;
        },
        roomIdState: (state, action) => {
            state.roomId = action.payload;
        },
        readyState: (state, action) => {
            state.isReady = action.payload;
        },
        currentRoomState: (state, action) => {
            state.currentRoom = action.payload;
        },
        addPeopleRoomState: (state, action) => {
            state.currentRoom = {
                ...state.currentRoom,
                roomPlayers: [...state.currentRoom.roomPlayers, action.payload],
            };
        },
        removePeopleRoomState: (state, action) => {
            state.currentRoom = {
                ...state.currentRoom,
                roomPlayers: state.currentRoom.roomPlayers.filter(
                    (player) => player.nickname !== action.payload.nickname
                ),
            };
        },
        deadPeopleState: (state, action) => {
            state.currentRoom = {
                ...state.currentRoom,
                roomPlayers: state.currentRoom.roomPlayers.map(
                    (player, index) => {
                        if (index === action.payload) {
                            // 해당 인덱스의 플레이어의 isDead 값을 true로 설정
                            return { ...player, isDead: true };
                        }
                        return player; // 다른 플레이어는 그대로 유지
                    }
                ),
            };
        },
        meInfoState: (state, action) => {
            state.meInfo = action.payload;
        },
        meSelectedInfoState: (state, action) => {
            state.meInfo.selectedIndex = action.payload;
        },
        heartState: (state, action) => {
            state.meHeart = action.payload;
        },
        decrementHeartState: (state) => {
            state.meHeart -= 1;
        },
        meDead: (state, action) => {
            state.meInfo.isDead = action.payload;
        }, 
        collideObjectState: (state, action) => {
            state.collideObj = action.payload;
        },
        addCollideObjectState: (state, action) => {
            const isExisting = state.collideObj.some(
                (obj) =>
                    obj.minX === action.payload.minX &&
                    obj.maxX === action.payload.maxX &&
                    obj.minY === action.payload.minY &&
                    obj.maxY === action.payload.maxY &&
                    obj.minZ === action.payload.minZ &&
                    obj.maxZ === action.payload.maxZ
            );
            if (!isExisting) {
                state.collideObj = [...state.collideObj, action.payload];
            }
        },
        removeCollideObjectState: (state, action) => {
            // action.payload에 해당하는 인덱스의 객체를 제거
            state.collideObj = state.collideObj.filter(
                (_item, index) => index !== action.payload
            );
        },
        bgmFlagState: (state, action) => {
            state.bgmFlag = action.payload;
        },
        mapSizeState: (state, action) => {
            state.mapSize = action.payload;
        },
        chatDataState: (state, action) => {
            state.chatData = action.payload;
        },
        addChatDataState: (state, action) => {
            state.chatData = [...state.chatData, action.payload];
        }, 
        observerState: (state, action) => {
            state.observer = action.payload;
        },  
        chatFlagState: (state, action) => {
            state.chatFlag = action.payload;
        },
        rerollState: (state, action) => {
            state.rerollTime = action.payload;
        }, 
        observserModeState: (state, action) => {
            state.observserMode = action.payload; 
        },
        channelIndexState: (state, action) => {
            state.channelIndex = action.payload; 
        },
        cameraPositionState: (state, action) => {
            state.cameraPosition = action.payload; 
        },
    },
});
export const {
    userNicknameState,
    roomIdState,
    readyState,
    currentRoomState,
    meInfoState,
    addPeopleRoomState,
    meSelectedInfoState,
    meDead,
    removePeopleRoomState,
    addCollideObjectState,
    removeCollideObjectState,
    collideObjectState,
    heartState,
    decrementHeartState,
    bgmFlagState,
    mapSizeState,
    chatDataState,
    addChatDataState, 
    observerState,  
    chatFlagState,
    deadPeopleState,
    rerollState, 
    observserModeState, 
    channelIndexState, 
    cameraPositionState,
} = userSlice.actions;
export default userSlice.reducer;
