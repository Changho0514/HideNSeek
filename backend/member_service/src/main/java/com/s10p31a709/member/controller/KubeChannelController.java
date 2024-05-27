package com.s10p31a709.member.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.s10p31a709.member.common.response.BaseResponse;
import com.s10p31a709.member.entity.Channel;
import com.s10p31a709.member.service.ChannelService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class KubeChannelController {

    private final ChannelService channelService;

    @GetMapping("/channel/kube")
    @Operation(summary = "채널 목록 반환")
    public ResponseEntity<?> channelList(){
        List<Channel> list = channelService.getChannel();
        return BaseResponse.success(200, "채널 목록 반환 성공", list);
    }
}
