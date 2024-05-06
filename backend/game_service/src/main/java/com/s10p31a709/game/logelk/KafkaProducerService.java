package com.s10p31a709.game.logelk;

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