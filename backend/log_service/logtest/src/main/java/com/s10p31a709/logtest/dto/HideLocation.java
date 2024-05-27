package com.s10p31a709.logtest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HideLocation {

    private Double[] position;
    private Double[] direction;
    private int selectedIndex;

}