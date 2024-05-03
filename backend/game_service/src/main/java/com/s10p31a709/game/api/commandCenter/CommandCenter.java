package com.s10p31a709.game.api.commandCenter;

import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.api.room.entity.Room;
import com.s10p31a709.game.api.room.repository.RoomRepository;
import com.s10p31a709.game.api.socket.model.StompPayload;
import com.s10p31a709.game.api.socket.service.RoomSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CommandCenter {

    private final RoomRepository roomRepository;
    private final RoomSocketService roomSocketService;

    @Scheduled(fixedRate = 1000)
    public void timeSchedule(){
        List<Room> rooms = roomRepository.findAllRoom();

        for (Room room : rooms){
            if (room.getRoomState() != null && !room.getRoomState().equals(0)) {

                // 시간 1초씩 감소
                room.setRoomTime(room.getRoomTime()-1);
                room.setFlag(true);

                // 시간이 다되면 다음 상태로 변경후 알림 전송
                if (room.getRoomTime() <= 0){
                    if(room.getRoomState() == 1){
                        roomSocketService.hideStart(room.getRoomId());
                    }else if(room.getRoomState() == 2){
                        roomSocketService.findStart(room.getRoomId());
                    }else if(room.getRoomState() == 3){
                        roomSocketService.hiderWin(room.getRoomId());
                    }else if(room.getRoomState() == 4 || room.getRoomState() == 5){
                        roomSocketService.backRoom(room.getRoomId());
                    }
                    continue;
                }

                // 한쪽팀이 다 죽어서 게임이 끝났는지 확인
                if(room.getRoomState() == 2 || room.getRoomState() == 3){
                    int aliveSeeker = 0;
                    int aliveHider = 0;
                    for (Player player : room.getRoomPlayers()){
                        if(!player.getIsDead()){
                            if (player.getIsSeeker()){
                                aliveSeeker++;
                            }else {
                                aliveHider++;
                            }
                        }
                    }
                    if(aliveHider == 0) roomSocketService.seekerWin(room.getRoomId());
                    if(aliveSeeker == 0) roomSocketService.hiderWin(room.getRoomId());
                }
            }
        }
    }

    @Scheduled(fixedRate = 5000)
    public void roomSchedule(){
        List<Room> rooms = roomRepository.findAllRoom();

        for (Room room : rooms){
            // 방들의 상태 체크. 비었으면 삭제, 호스트가 없으면 교체
            if(room.getRoomPlayers().isEmpty()) {
                roomSocketService.deleteRoom(room.getRoomId());
                log.info("방 삭제 (roomId : {})", room.getRoomId());
            }
            else {
                String host = null;
                for (Player player : room.getRoomPlayers()){
                    if (room.getRoomAdmin().equals(player.getNickname())) host = player.getNickname();
                }
                if(host == null) {
                    log.info("방장 교체 (roomId : {})", room.getRoomId());
                    roomSocketService.changeAdmin(room);
                }
            }
        }
    }

    @Scheduled(fixedRateString = "#{ 1000 / ${game.fps}}")
    public void positionSchedule(){
        List<Room> rooms = roomRepository.findAllRoom();
        for (Room room : rooms){
            if (room.getRoomState() != null && room.isFlag()) {
                roomSocketService.sendPosition(room);
                room.setFlag(false);
            }
        }
    }

}
