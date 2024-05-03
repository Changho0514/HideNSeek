package com.s10p31a709.game.common.feign.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

//@FeignClient(name = "member-service", url = "http://localhost:8001/api/member-service")
@FeignClient(name = "member-service", url = "${server.domain}/api/member-service")
public interface MemberServiceClient {

    @DeleteMapping("/guest/{nickname}")
    void deleteGuest(@PathVariable("nickname") String nickname);

}
