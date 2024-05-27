package com.s10p31a709.game.api.room.repository;


import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.api.room.entity.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
public class RoomRepository {

    private final List<Room> rooms= new CopyOnWriteArrayList<>();


    // Room -------------------------------------------------------------------------
    public List<Room> findAllRoom(){
        return rooms;
    }

    public Room findRoomByRoomId(String roomId){
        for (Room room : rooms){
            if(room.getRoomId().equals(roomId)) return room;
        }
        return null;
    }

    public Room findRoomByNickname(String nickname){
        for (Room room : rooms){
            for (Player player : room.getRoomPlayers()){
                if (player.getNickname().equals(nickname)) return room;
            }
        }
        return null;
    }

    public Room saveRoom(Room room){
        rooms.add(room);
        return room;
    }

    public void deleteRoomByRoomId(String roomId){
        for (int i = 0; i <rooms.size() ; i++) {
            if(rooms.get(i).getRoomId().equals(roomId)){
                rooms.remove(i);
                return;
            }
        }
    }

    // Player -----------------------------------------------------------------------------
    public Player findPlayerByNickname(String nickname){
        for (Room room : rooms){
            List<Player> players = room.getRoomPlayers();
            for (Player player : players){
                if(player.getNickname().equals(nickname)) return player;
            }
        }
        return null;
    }

    public Player findPlayerBySessionId(String sessionId){
        for (Room room : rooms) {
            for (int i = 0; i < room.getRoomPlayers().size(); i++) {
                Player player = room.getRoomPlayers().get(i);
                if (player.getSessionId() != null && player.getSessionId().equals(sessionId)) {
                    return player;
                }
            }
        }
        return null;
    }

    public Player savePlayer(String roomId, Player player){
        Room room = findRoomByRoomId(roomId);
        room.getRoomPlayers().add(player);
        return player;
    }

    public void deletePlayerByNickname(String nickname){
        for (Room room : rooms) {
            for (int i = 0; i < room.getRoomPlayers().size(); i++) {
                if (room.getRoomPlayers().get(i).getNickname().equals(nickname)) {
                    room.getRoomPlayers().remove(i);
                    return;
                }
            }
        }
    }

}
