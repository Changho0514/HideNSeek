package com.s10p31a709.game.api.room.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Channel {

    private String name;
    private int count;
    private String address;

}
