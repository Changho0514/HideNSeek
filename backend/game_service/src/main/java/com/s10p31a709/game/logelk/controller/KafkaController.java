package com.s10p31a709.game.logelk.controller;

import com.s10p31a709.game.logelk.entity.HideLocation;
import com.s10p31a709.game.logelk.service.GameResultService;
import com.s10p31a709.game.logelk.service.HideLocationService;
import com.s10p31a709.game.common.response.BaseResponse;
import com.s10p31a709.game.logelk.entity.GameResult;
import com.s10p31a709.game.logelk.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kafka-test")
@Slf4j
public class KafkaController {

    private final KafkaProducerService producerService;
    private final GameResultService gameResultService;
    private final HideLocationService hideLocationService;

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

    @GetMapping("/result")
    public ResponseEntity<?> getResultList(){
        return BaseResponse.success(200, "성공", gameResultService.findAll());
    }

    @PostMapping("/result")
    public ResponseEntity<?> registerResult(@RequestBody GameResult gameResult){
        gameResultService.save(gameResult);
        return BaseResponse.success(201, "성공");
    }

    @GetMapping("/location")
    public ResponseEntity<?> getLocationList(){
        return BaseResponse.success(200, "성공", hideLocationService.findAll());
    }

    @PostMapping("/location")
    public ResponseEntity<?> registerLocation(@RequestBody HideLocation hideLocation){
        hideLocationService.save(hideLocation);
        return BaseResponse.success(201, "성공");
    }



}