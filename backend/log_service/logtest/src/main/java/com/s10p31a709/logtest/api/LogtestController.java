package com.s10p31a709.logtest.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Slf4j(topic = "elk")
public class LogtestController {
    @GetMapping("/log")
    public String logTest() {
        log.info("log 테스트");
        return "ok";
    }


}