package com.s10p31a709.logtest.config;

import org.apache.kafka.common.config.TopicConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaAdmin;

@Configuration
public class KafkaTopicConfiguration {

    @Bean
    public KafkaAdmin.NewTopics newTopics() {
        return new KafkaAdmin.NewTopics(
                //prod-연습용
//                TopicBuilder.name("prd.game-server.result-log.json")
//                    .partitions(2)
//                    .replicas(3)
//                    .config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(1000 * 60 * 60 * 24 * 7 )) //일단 7일 나중에 변경
//                    .build(),
                //dev-실전용-------------------------------------------------------
                TopicBuilder.name("dev.game-server.result-log.json")
                        .partitions(2)
                        .replicas(3)
                        .config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(1000 * 60 * 60 * 24 * 7 )) //일단 7일 나중에 변경
                        .build(),
                TopicBuilder.name("dev.game-server.hide-location-log.json")
                    .partitions(2)
                    .replicas(3)
                    .config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(1000 * 60 * 60 * 24 * 7 )) //일단 7일 나중에 변경
                    .build(),
                TopicBuilder.name("dev.game-server.attacked-objects-log.json")
                    .partitions(2)
                    .replicas(3)
                    .config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(1000 * 60 * 60 * 24 * 7 )) //일단 7일 나중에 변경
                    .build()
        );
    }
}
