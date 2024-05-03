package com.s10p31a709.game.api.room.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {

    private String roomId;

    private String roomAdmin;

    private String roomTitle;

    @JsonProperty("isPublic")
    private Boolean isPublic;

    private String roomPassword;

    private Integer roomState;

    private Integer roomTime;

    private String roomMap;

    private List<Player> roomPlayers;

    private List<Player> computers;

    @JsonIgnore
    private boolean flag;

}

