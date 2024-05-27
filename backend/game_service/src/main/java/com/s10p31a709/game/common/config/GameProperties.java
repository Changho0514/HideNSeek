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
    private int fps;
    private RichRoom richRoom;
    private Farm farm;

    @Data
    public static class Time {
        private int waiting;
        private int hide;
        private int seek;
        private int result;
    }

    @Data
    public static class GameMap {
        private int maxSeekerIdx;
        private int maxHiderIdx;
        private Double[] startPoint;
        private int maxMapValue;
    }

    public static class RichRoom extends GameMap{
    }

    public static class Farm extends GameMap{
    }

}
