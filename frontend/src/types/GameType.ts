import { Triplet } from '@react-three/cannon';
import { Vector3 } from 'three';

export interface PlayerInitType {
    player: any;
    position: Vector3;
    modelIndex?: number;
    selectedIndex?: number | null;
    direction?: number[];
    isDead?: boolean | null;
    isSeeker?: boolean | null;
    isFixed?: boolean;
}
export interface CurrentPlayersInfo {
    id?: string;
    nickname?: string;
    selectedIndex?: number | null;
    position: number[];
    direction?: number[];
    isDead?: boolean | null;
    isSeeker?: boolean | null;
    isFixed?: boolean;
}
export interface MeInfo {
    id: string;
    selectedIndex?: number;
    isDead?: boolean | null;
    isSeeker?: boolean | null;
    isFixed?: boolean | null;
}

export interface RoomInfo {
    isPublic: boolean;
    roomId: string;
    roomAdmin?: string;
    roomMap: string | null;
    roomPassword: string;
    roomPlayers: CurrentPlayersInfo[];
    roomState: number | null;
    roomTime: number | null;
    roomTitle: string;
    botCnt: number | null;
    mapValue: number | null,
}

export interface GuestLoginInfo {
    nickname: string;
}
export interface UserLoginInfo {
    nickname: string;
    password: string;
}
export interface MakeRoomState {
    roomTitle: string;
    roomPassword: string;
    roomAdmin: string;
    isPublic: boolean;
}
export interface EnterRoomState {
    roomId: string;
    roomPassword?: string;
    nickname: string;
}
export interface CollideObject {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
}
export interface ObjectSettingType {
    position: Triplet;
    rotation?: Triplet;
    scale?: Triplet;
}

export interface MapSize {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
    minY: number;
    maxY: number;
}
export interface ChatType {
    nickname: string;
    content: string;
}

export interface ThumbnailType {
    index: number;
    thumbnail: string;
    name: string;
}
