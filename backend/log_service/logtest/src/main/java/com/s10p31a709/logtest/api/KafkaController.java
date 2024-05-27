package com.s10p31a709.logtest.api;

import com.s10p31a709.logtest.dto.AttackedObject;
import com.s10p31a709.logtest.dto.GameResult;
import com.s10p31a709.logtest.dto.HideLocation;
import com.s10p31a709.logtest.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kafka-test")
public class KafkaController {
    private final KafkaProducerService producerService;

    //prod-연습용
//    @PostMapping("/game-result-log/prod")
//    public String sendGameResultProd(@RequestBody GameResult gameResult) {
//        producerService.createGameResultProd(gameResult);
//        return "success";
//    }
    //dev-실전용-------------------------------------------------------
    @PostMapping("/game-result-log/dev")
    public String sendGameResultDev(@RequestBody GameResult gameResult) {
        producerService.createGameResultDev(gameResult);
        return "success";
    }
    @PostMapping("/hide-location-log/dev")
    public String sendHideLocationLogDev(@RequestBody HideLocation hideLocation) {
        producerService.createHideLocationLogDev(hideLocation);
        return "success";
    }
    @PostMapping("/attacked-objects-log/dev")
    public String sendAttackedObjectDev(@RequestBody AttackedObject attackedObject) {
        producerService.createAttackedObjectLogDev(attackedObject);
        return "success";
    }
}