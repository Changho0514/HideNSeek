package com.s10p31a709.game.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "game")
@Data
public class GameProperties {

    private Time time;
    private int maxCapacity;
    private Object object;
    private int fps;


    @Data
    public static class Time {
        private int waiting;
        private int hide;
        private int seek;
        private int result;
    }
    @Data
    public static class Object {
        private int maxSeekerIdx;
        private int maxHiderIdx;
    }

}
