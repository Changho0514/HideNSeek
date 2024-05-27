package com.s10p31a709.game.logelk.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName = "dev.game-server.hide-location-log.json-*")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HideLocation {

    @Id
    private String id;
    private String map;
    private Double[] position;
    private Double[] direction;
    private Integer selectedIndex;

}