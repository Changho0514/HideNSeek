package com.s10p31a709.game.api.commandCenter;

import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.api.room.entity.Room;
import com.s10p31a709.game.api.room.repository.RoomRepository;
import com.s10p31a709.game.api.socket.service.RoomSocketService;
import com.s10p31a709.game.common.config.GameProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CommandCenter {

    private final RoomRepository roomRepository;
    private final RoomSocketService roomSocketService;
    private final GameProperties gameProperties;

    @Scheduled(fixedRate = 1000)
    public void timeSchedule(){
        List<Room> rooms = roomRepository.findAllRoom();

        for (Room room : rooms){
            room.setFlag(true);
            if (room.getRoomState() != null && !room.getRoomState().equals(0)) {

                // 시간 1초씩 감소
                room.setRoomTime(room.getRoomTime()-1);

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

                // 리롤타임판단
                if(room.getRoomState() == 3){
                    int halfTime = gameProperties.getTime().getSeek()/2;
                    if(room.getRoomTime().equals(halfTime)){
                        roomSocketService.rerollStart(room.getRoomId());
                    }else if(room.getRoomTime().equals(halfTime-20)){
                        roomSocketService.rerollEnd(room.getRoomId());
                    }
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

    // 방의 상태 fps만큼 전송. 변경사항이 없는 경우(flag = false)는 전송하지 않음.
    // 시간이 변하면 flag = true가 되므로 최소 1초에 한번은 전송
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
