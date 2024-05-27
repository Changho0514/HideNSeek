package com.s10p31a709.game.common.feign.service;

import com.s10p31a709.game.common.feign.entity.Member;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

//@FeignClient(name = "member-service", url = "http://localhost:8001/api/member-service")
@FeignClient(name = "member-service", url = "${server.domain}/api/member-service")
public interface MemberServiceClient {

    @DeleteMapping("/guest/{nickname}")
    void deleteGuest(@PathVariable("nickname") String nickname);

    @PostMapping("/guest")
    void enterGuest(Member member);

}
