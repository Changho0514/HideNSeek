package com.s10p31a709.game.api.room.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Player {

    private String nickname;

    private Integer selectedIndex;

    @JsonProperty("isDead")
    private Boolean isDead;

    @JsonProperty("isSeeker")
    private Boolean isSeeker;

    private Double[] position;

    private Double[] direction;

    @JsonIgnore
    private String sessionId;

}
