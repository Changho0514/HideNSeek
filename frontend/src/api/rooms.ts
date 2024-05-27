import localAxios from '../components/utils/http-common';
import { EnterRoomState, MakeRoomState } from '../types/GameType';

const local = localAxios();

/**GET: 방 리스트 조회 */
export async function roomList(channel: string) {
    if(`${import.meta.env.VITE_REACT_API_URL}`.includes("hidebowwow"))
        return await local.get(`/api/game-service/ch/${channel}/rooms`);
    else
        return await local.get(`/api/game-service/rooms`)
}

/**POST: 방생성 */
export async function roomMake(roomInfo: MakeRoomState, channel: string) {
    if(`${import.meta.env.VITE_REACT_API_URL}`.includes("hidebowwow"))
        return await local.post(`/api/game-service/ch/${channel}/rooms`, roomInfo);
    else
        return await local.post(`/api/game-service/rooms`, roomInfo);
}
/**GET: 방 조회 */
export async function getRoom(id: string, channel: string) {
    if(`${import.meta.env.VITE_REACT_API_URL}`.includes("hidebowwow"))
        return await local.get(`/api/game-service/ch/${channel}/rooms/${id}`);
    else
        return await local.get(`/api/game-service/rooms/${id}`);
}

/**POST: 방 입장 */
export async function enterRoom(checkInfo: EnterRoomState, channel: string) {
    if(`${import.meta.env.VITE_REACT_API_URL}`.includes("hidebowwow"))
        return await local.post(`/api/game-service/ch/${channel}/rooms/enter`, checkInfo);
    else
        return await local.post(`/api/game-service/rooms/enter`, checkInfo);
}
/**GET: 채널 조회 */
export async function getChannel() {
    if(`${import.meta.env.VITE_REACT_API_URL}`.includes("hidebowwow"))
        return await local.get(`/api/member-service/channel/kube`);
    else
        return await local.get(`/api/member-service/channel`);
}
