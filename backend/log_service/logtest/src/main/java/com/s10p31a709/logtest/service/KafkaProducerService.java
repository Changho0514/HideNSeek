package com.s10p31a709.logtest.service;

import com.s10p31a709.logtest.dto.AttackedObject;
import com.s10p31a709.logtest.dto.GameResult;
import com.s10p31a709.logtest.dto.HideLocation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class KafkaProducerService {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    //prod-연습용
//    public void createGameResultProd(GameResult gameResult) {
//        log.info("gameResult: {}", gameResult);
//        kafkaTemplate.send("prd.game-server.result-log.json", gameResult);
//    }
    //dev-실전용-------------------------------------------------------
    public void createGameResultDev(GameResult gameResult) {
        log.info("gameResult: {}", gameResult);
        kafkaTemplate.send("dev.game-server.result-log.json", gameResult);
    }

    public void createHideLocationLogDev(HideLocation hideLocation) {
        log.info("hideLocation: {}", hideLocation);
        kafkaTemplate.send("dev.game-server.hide-location-log.json", hideLocation);
    }

    public void createAttackedObjectLogDev(AttackedObject attackedObject) {
        log.info("hideLocation: {}", attackedObject);
        kafkaTemplate.send("dev.game-server.attacked-objects-log.json", attackedObject);
    }
}