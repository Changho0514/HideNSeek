package com.s10p31a709.logtest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameResult {

    private String map;
    private Boolean isSeekerWin;
    private int endTime;
    private int seekerCount;
    private int hiderCount;

}