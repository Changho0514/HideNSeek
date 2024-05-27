package com.s10p31a709.game.api.room.service;

import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.api.room.entity.Room;
import com.s10p31a709.game.api.room.repository.RoomRepository;
import com.s10p31a709.game.common.config.GameProperties;
import com.s10p31a709.game.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomService {

    private final RoomRepository roomRepository;
    private final GameProperties gameProperties;
    public List<Room> getRoomList(){
        return roomRepository.findAllRoom();
    }

    public Room getRoom(String roomId){
        Room room = roomRepository.findRoomByRoomId(roomId);
        if (room == null) throw new CustomException(404, "방이 존재하지 않습니다");

        return room;
    }

    public Room createRoom(Room room){
        room.setRoomId(UUID.randomUUID().toString());
        room.setRoomPlayers(new CopyOnWriteArrayList<>());
        room.setRoomState(0);
        room.setRoomTime(0);
        room.setBotCnt(0);
        room.setRoomMap("richRoom");
        return roomRepository.saveRoom(room);
    }

    public void checkEnter(String roomId, String password, String nickname){
        Room room = roomRepository.findRoomByRoomId(roomId);
        if(room == null) throw new CustomException(404, "방이 존재하지 않습니다");
        if(room.getRoomPlayers().stream().filter(player -> !player.getNickname().startsWith("Computer")).collect(Collectors.toList()).size() >= gameProperties.getMaxCapacity()) throw new CustomException(400, "방이 가득 찼습니다.");
        if(!room.getRoomState().equals(0)) throw new CustomException(400, "게임이 진행중인 방 입니다");
        if(!room.getIsPublic() && !room.getRoomPassword().equals(password)) throw new CustomException(400, "비밀번호가 틀렸습니다.");
    }

    public void deletePlayer(String nickname){
        Room room = roomRepository.findRoomByNickname(nickname);
        if (room == null) return ; // room이 null일경우 예외처리
        for (int i = 0; i < room.getRoomPlayers().size(); i++) {
            if (room.getRoomPlayers().get(i).getNickname().equals(nickname)){
                room.getRoomPlayers().remove(i);
                log.info("잔여인원 삭제: {}", nickname);
                return;
            }
        }
    }

}
