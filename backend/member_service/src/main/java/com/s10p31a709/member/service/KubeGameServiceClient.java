package com.s10p31a709.member.service;

import com.s10p31a709.member.common.response.BaseResponse;
import com.s10p31a709.member.entity.Channel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

//@FeignClient(name = "member-service", url = "http://localhost:8001/api/member-service")
@FeignClient(name = "kube-game-service", url = "${server.domain}/api/game-service/ch")
public interface KubeGameServiceClient {

    @DeleteMapping("/{channelId}/rooms/player/{nickname}")
    void deletePlayer(@PathVariable("channelId") int channelId, @PathVariable("nickname") String nickname);

    @GetMapping("/{channelId}/rooms/channel")
    Channel channelInfoKube(@PathVariable("channelId") int channelId);

}
