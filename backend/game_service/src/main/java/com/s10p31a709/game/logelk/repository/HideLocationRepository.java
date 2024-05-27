package com.s10p31a709.game.logelk.repository;


import com.s10p31a709.game.logelk.entity.HideLocation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface HideLocationRepository extends ElasticsearchRepository<HideLocation, String> {

    List<HideLocation> findAllByMap(String map);

}
