package com.s10p31a709.game.logelk.repository;

import com.s10p31a709.game.logelk.entity.GameResult;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface GameResultRepository extends ElasticsearchRepository<GameResult, String> {
}
