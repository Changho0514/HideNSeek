package com.s10p31a709.game.logelk.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName = "dev.game-server.result-log.json-*")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameResult {

    @Id
    private String id;
    private String map;
    private Integer seekerCount;
    private Integer hiderCount;
    private Boolean isSeekerWin;
    private Integer playTime;

}
