package com.s10p31a709.game.api.room.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.s10p31a709.game.api.room.entity.Channel;
import com.s10p31a709.game.api.room.entity.Room;
import com.s10p31a709.game.api.room.service.RoomService;
import com.s10p31a709.game.common.response.BaseResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ch/{channelId}/rooms")
@Tag(name = "RoomController", description = "방을 관리하는 REST API")
public class KubeRoomController {

    private final RoomService roomService;

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${server.servlet.contextPath}")
    private String contextPath;

    @GetMapping
    @Operation(summary = "방 목록 반환")
    public ResponseEntity<?> getRoomList(@PathVariable("channelId") String channelId){
        return BaseResponse.success(200, "방 목록 반환 성공", roomService.getRoomList());
    }

    @GetMapping("{roomId}")
    @Operation(summary = "특정 방 정보 반환")
    public ResponseEntity<?> getRoom(@PathVariable("channelId") String channelId, @PathVariable("roomId") String roomId){
        return BaseResponse.success(200, "방조회 성공", roomService.getRoom(roomId));
    }

    @PostMapping
    @Operation(summary = "방 생성", description = "title, public, password 를 보내주세요")
    public ResponseEntity<?> createRoom(@PathVariable("channelId") String channelId, @RequestBody Room room){
        return BaseResponse.success(201, "방생성 성공", roomService.createRoom(room));
    }

    @PostMapping("/enter")
    @Operation(summary = "방 입장", description = "roomId, password, nickname을 json으로 보내주세요")
    public ResponseEntity<?> enterRoom(@PathVariable("channelId") String channelId, @RequestBody Map<String, String> map){
        String roomId = map.get("roomId");
        String password = map.get("roomPassword");
        String nickname = map.get("nickname");
        roomService.checkEnter(roomId, password, nickname);
        return BaseResponse.success(200, "방입장 성공", roomService.getRoom(roomId));
    }

    @GetMapping("/channel")
    @Operation(summary = "현재 채널의 이름(name), 사람수(count), 주소(address) 반환")
    public Channel channelInfo(@PathVariable("channelId") String channelId){
        List<Room> list = roomService.getRoomList();
        int cnt = 0;
        for (Room room : list){
            cnt += room.getRoomPlayers().stream().filter(player -> !player.getNickname().startsWith("Computer")).collect(Collectors.toList()).size();
        }

        return new Channel(applicationName, cnt, contextPath);
    }

    @DeleteMapping("/player/{nickname}")
    @Operation(summary = "해당 멤버 방에서 삭제")
    public ResponseEntity<?> deletePlayer(@PathVariable("channelId") String channelId, @PathVariable("nickname") String nickname){
        roomService.deletePlayer(nickname);
        return BaseResponse.success(200, "멤버 삭제 성공");
    }

}
