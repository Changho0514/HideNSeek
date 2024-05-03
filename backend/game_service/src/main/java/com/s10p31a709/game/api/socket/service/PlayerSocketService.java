package com.s10p31a709.game.api.socket.service;

import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.api.room.entity.Room;
import com.s10p31a709.game.api.room.repository.RoomRepository;
import com.s10p31a709.game.api.socket.model.StompPayload;
import com.s10p31a709.game.common.config.GameProperties;
import com.s10p31a709.game.common.feign.service.MemberServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayerSocketService {

    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MemberServiceClient memberServiceClient;
    private final GameProperties gameProperties;

    public void exitPlayer(String sessionId){
        Player player = roomRepository.findPlayerBySessionId(sessionId);
        if (player == null) return;
        Room room = roomRepository.findRoomByNickname(player.getNickname());
        if (room == null) return;

        StompPayload<Player> payload = new StompPayload<>("player.exit", room.getRoomId(), "system", player);
        simpMessagingTemplate.convertAndSend("/sub/room/"+room.getRoomId(), payload);
        try {
            memberServiceClient.deleteGuest(player.getNickname());
        }catch (Exception e){
            log.error(e.toString());
        }
        roomRepository.deletePlayerByNickname(player.getNickname());
    }

    public void enterPlayer(StompPayload<Player> message){
        Player player = roomRepository.savePlayer(message.getRoomId(), message.getData());

        StompPayload<Player> payload = new StompPayload<>("player.enter", message.getRoomId(), "system", player);
        simpMessagingTemplate.convertAndSend("/sub/room/"+message.getRoomId(), payload);
    }

    public void movePlayer(StompPayload<Player> message){
        Player player = roomRepository.findPlayerByNickname(message.getData().getNickname());
        player.setPosition(message.getData().getPosition());
        player.setDirection(message.getData().getDirection());

        // 변한값이 있다는걸 flag에 저장
        Room room = roomRepository.findRoomByRoomId(message.getRoomId());
        room.setFlag(true);

//        이동 후 변화값을 전송하지 않고, commandCenter에서 30ms마다 따로 전송한다.
    }

    public void deadPlayer(StompPayload<Player> message){
        Player player = roomRepository.findPlayerByNickname(message.getData().getNickname());
        player.setIsDead(true);

        StompPayload<Player> payload = new StompPayload<>("player.dead", message.getRoomId(), "system", player);
        simpMessagingTemplate.convertAndSend("/sub/room/"+message.getRoomId(), payload);
    }

    public void objectPlayer(StompPayload<Player> message){
        Player player = roomRepository.findPlayerByNickname(message.getData().getNickname());
        player.setSelectedIndex(message.getData().getSelectedIndex());

        StompPayload<Player> payload = new StompPayload<>("player.object", message.getRoomId(), "system", player);
        simpMessagingTemplate.convertAndSend("/sub/room/"+message.getRoomId(), payload);
    }

    public void choosePlayer(String roomId) {
        int maxIdx = gameProperties.getObject().getMaxHiderIdx();
        int[] arr = new int[]{new Random().nextInt(maxIdx), new Random().nextInt(maxIdx), new Random().nextInt(maxIdx)};
        StompPayload<int[]> payload = new StompPayload<>("player.choose", roomId, "system", arr);
        simpMessagingTemplate.convertAndSend("/sub/room/"+roomId, payload);
    }
    
    public void playerFix(StompPayload<Player> message){
        String roomId = message.getRoomId();;
        Player player = message.getData();
        // 숨은 정보 log 전송
    }
}
