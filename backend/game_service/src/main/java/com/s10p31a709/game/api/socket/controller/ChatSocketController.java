package com.s10p31a709.game.api.socket.controller;

import com.s10p31a709.game.api.room.entity.Chat;
import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.api.room.entity.Room;
import com.s10p31a709.game.api.socket.model.StompPayload;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ChatSocketController", description = "채팅 관련 socket 요청 (swagger 에서 테스트 불가)")
@RequiredArgsConstructor
@RestController
public class ChatSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat") @DeleteMapping("/chat")
    @Operation(summary = "범용적 테스트용", description = "받은 payload를 그대로 방 사람들에게 전달한다.")
    public void chatBaseMessage(@Payload StompPayload<Chat> message) {
        simpMessagingTemplate.convertAndSend("/sub/room/"+message.getRoomId(), message);
    }

    @MessageMapping("/chat.player") @DeleteMapping("/chat.player")
    @Operation(summary = "플레이어의 채팅")
    public void chatPlayer(@Payload StompPayload<Chat> message) {
        simpMessagingTemplate.convertAndSend("/sub/room/"+message.getRoomId(), message);
    }

    @MessageMapping("/chat.system") @DeleteMapping("/chat.system")
    @Operation(summary = "시스템 알림")
    public void chatSystem(@Payload StompPayload<Chat> message) {
        simpMessagingTemplate.convertAndSend("/sub/room/"+message.getRoomId(), message);
    }

    @MessageMapping("/chat.voice") @DeleteMapping("/chat.voice")
    @Operation(summary = "음성 채팅 소켓", description="음성채팅 연결 시 /sub/voice/{roomId} 로 구독")
    public void chatVoice(@Payload StompPayload<Chat> message) {
        simpMessagingTemplate.convertAndSend("/sub/voice/"+message.getRoomId(), message);
    }

}
