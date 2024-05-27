package com.s10p31a709.game.api.socket.service;

import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.api.room.entity.Room;
import com.s10p31a709.game.api.room.repository.RoomRepository;
import com.s10p31a709.game.api.socket.model.StompPayload;
import com.s10p31a709.game.common.config.GameProperties;
import com.s10p31a709.game.logelk.service.GameResultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomSocketService {

    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final AIService aiService;
    private final GameProperties gameProperties;
    private final GameResultService gameResultService;


    public void modifyRoom(StompPayload<Room> message){
        Room room = roomRepository.findRoomByRoomId(message.getData().getRoomId());
        if(room == null) return;

        if(message.getData().getIsPublic() != null) room.setIsPublic(message.getData().getIsPublic());
        if(message.getData().getRoomPassword() != null) room.setRoomPassword(message.getData().getRoomPassword());
        if(message.getData().getRoomMap() != null) room.setRoomMap(message.getData().getRoomMap());
        if(message.getData().getRoomAdmin() != null) room.setRoomAdmin(message.getData().getRoomAdmin());
        if(message.getData().getRoomTitle() != null && !message.getData().getRoomTitle().isEmpty()) room.setRoomTitle(message.getData().getRoomTitle());
        if(message.getData().getBotCnt() != null) room.setBotCnt(message.getData().getBotCnt());
        log.info(message.toString());

        StompPayload<Room> payload = new StompPayload<>("room.modify", message.getRoomId(), "system", room);
        simpMessagingTemplate.convertAndSend("/sub/room/"+message.getRoomId(), payload);
    }

    public void gameInit(StompPayload<Room> message){
        Room room = roomRepository.findRoomByRoomId(message.getRoomId());
        room.setRoomTime(gameProperties.getTime().getWaiting());

        // 맵 판단해서 적용
        GameProperties.GameMap gameMap;
        if(room.getRoomMap().equals("richRoom") || room.getRoomMap().equals("richroom")){
            gameMap = gameProperties.getRichRoom();
            room.setRoomState(1);
        } else if (room.getRoomMap().equals("farm")) {
            gameMap = gameProperties.getFarm();
            room.setRoomState(1);
        } else{
            log.error("{}에 해당하는 맵이 없어 시작할 수 없습니다.", room.getRoomMap());
            room.setRoomState(0);
            return;
        }

        int seekerNumber1 = new Random().nextInt(room.getRoomPlayers().size());
        int seekerNumber2 = (room.getRoomPlayers().size() + room.getBotCnt() >= 6)? new Random().nextInt(room.getRoomPlayers().size()): -1;
        while (seekerNumber2 != -1 && seekerNumber1 == seekerNumber2){
            seekerNumber2 = new Random().nextInt(room.getRoomPlayers().size());
        }
        int seekerNumber3 = (room.getRoomPlayers().size() + room.getBotCnt() >= 9)? new Random().nextInt(room.getRoomPlayers().size()): -1;
        while (seekerNumber3 != -1 && (seekerNumber1 == seekerNumber3 || seekerNumber2 == seekerNumber3)){
            seekerNumber3 = new Random().nextInt(room.getRoomPlayers().size());
        }

        // 시연때 술래를 방제목으로 지정
        if(room.getRoomTitle().startsWith("시연")){
            String[] nums = room.getRoomTitle().split("_");
            if(nums.length >= 2 ){
                seekerNumber1 = Integer.parseInt(nums[1]);
            }
            if(nums.length >= 3){
                seekerNumber2 = Integer.parseInt(nums[2]);
            }
            if(nums.length >= 4){
                seekerNumber3 = Integer.parseInt(nums[2]);
            }
            log.info("시연용 술래 지정: {}, {}, {}",seekerNumber1, seekerNumber2, seekerNumber3);
        }
        log.info("room.getRoomPlayers().size(): {}", room.getRoomPlayers().size());
        log.info("seekerNumber1: {}", seekerNumber1);
        log.info("seekerNumber2: {}", seekerNumber2);
        log.info("seekerNumber3: {}", seekerNumber3);

        for (int i = 0; i < room.getRoomPlayers().size(); i++) {
            Player player = room.getRoomPlayers().get(i);
            player.setPosition(gameMap.getStartPoint());
            player.setDirection(new Double[]{0d, 0d, 0d});
            player.setIsDead(false);
            if(i == seekerNumber1 || i == seekerNumber2 || i == seekerNumber3) {
                player.setIsSeeker(true);
                player.setSelectedIndex(new Random().nextInt(gameMap.getMaxSeekerIdx()));
                log.info("seekerIdx: {}", i);
            }else {
                player.setIsSeeker(false);
                player.setSelectedIndex(null);
            }
        }

        // mapValue 담기
        room.setMapValue(new Random().nextInt(gameMap.getMaxMapValue()));

        // 봇 생성
        if (room.getBotCnt() != null && !room.getBotCnt().equals(0)){
            log.info("botCnt: {}", room.getBotCnt());
            List<Player> list = aiService.hideLocationComputer(room.getBotCnt(), room.getRoomMap());
            
            // 시연시 지정된 봇2명 추가
            if(room.getRoomTitle().startsWith("시연")){
                list = aiService.demonstration();
            }
            log.info("컴퓨터 추가! : {}", list);
            room.getRoomPlayers().addAll(list);
            log.info("players: {}", room.getRoomPlayers());
        }

        StompPayload<Room> payload = new StompPayload<>("room.gameInit", message.getRoomId(), "system", room);
        simpMessagingTemplate.convertAndSend("/sub/room/"+message.getRoomId(), payload);
        log.info(room.toString());
    }

    public void hideStart(String roomId){
        Room room = roomRepository.findRoomByRoomId(roomId);
        room.setRoomTime(gameProperties.getTime().getHide());
        room.setRoomState(2);
        log.info(room.toString());

        StompPayload<Room> payload = new StompPayload<>("room.hideStart", roomId, "system", room);
        simpMessagingTemplate.convertAndSend("/sub/room/"+roomId, payload);
    }

    public void findStart(String roomId){
        Room room = roomRepository.findRoomByRoomId(roomId);
        room.setRoomTime(gameProperties.getTime().getSeek());
        room.setRoomState(3);
        log.info(room.toString());

        StompPayload<Room> payload = new StompPayload<>("room.findStart", roomId, "system", room);
        simpMessagingTemplate.convertAndSend("/sub/room/"+roomId, payload);
    }

    public void seekerWin(String roomId){
        Room room = roomRepository.findRoomByRoomId(roomId);
        room.setRoomState(4);
        log.info(room.toString());

        // 게임 결과 log 전송
        gameResultService.sendGameResult(room);

        room.setRoomTime(gameProperties.getTime().getResult());
        StompPayload<Room> payload = new StompPayload<>("room.seekerWin", roomId, "system", room);
        simpMessagingTemplate.convertAndSend("/sub/room/"+roomId, payload);
    }

    public void hiderWin(String roomId){
        Room room = roomRepository.findRoomByRoomId(roomId);
        room.setRoomState(5);
        log.info(room.toString());

        // 게임 결과 log 전송
        gameResultService.sendGameResult(room);

        room.setRoomTime(gameProperties.getTime().getResult());
        StompPayload<Room> payload = new StompPayload<>("room.hiderWin", roomId, "system", room);
        simpMessagingTemplate.convertAndSend("/sub/room/"+roomId, payload);
    }

    public void backRoom(String roomId){
        Room room = roomRepository.findRoomByRoomId(roomId);
        room.setRoomTime(0);
        room.setRoomState(0);
        log.info(room.toString());

        // 봇 삭제
        List<Player> players = room.getRoomPlayers();
        room.setRoomPlayers(players.stream().filter(player -> !player.getNickname().startsWith("Computer")).collect(Collectors.toList()));


        StompPayload<Room> payload = new StompPayload<>("room.backRoom", roomId, "system", room);
        simpMessagingTemplate.convertAndSend("/sub/room/"+roomId, payload);
    }

    public void deleteRoom(String roomId){
        roomRepository.deleteRoomByRoomId(roomId);
    }

    public void changeAdmin(Room room){
        room.setRoomAdmin(room.getRoomPlayers().get(0).getNickname());

        StompPayload<Room> payload = new StompPayload<>("room.changeAdmin", room.getRoomId(), "system", room);
        simpMessagingTemplate.convertAndSend("/sub/room/"+room.getRoomId(), payload);
    }

    public void sendPosition(Room room){
        StompPayload<Room> payload = new StompPayload<>("room.gameState", room.getRoomId(), "system", room);
        simpMessagingTemplate.convertAndSend("/sub/room/"+room.getRoomId(), payload);
    }

    public void rerollStart(String roomId){
        StompPayload<Room> payload = new StompPayload<>("room.rerollStart", roomId, "system", null);
        simpMessagingTemplate.convertAndSend("/sub/room/"+roomId, payload);
        log.info("rerollStart: {}", roomId);
    }

    public void rerollEnd(String roomId){
        StompPayload<Room> payload = new StompPayload<>("room.rerollEnd", roomId, "system", null);
        simpMessagingTemplate.convertAndSend("/sub/room/"+roomId, payload);
        log.info("rerollEnd: {}", roomId);
    }

}
