package com.s10p31a709.game.logelk.service;

import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.api.room.entity.Room;
import com.s10p31a709.game.common.config.GameProperties;
import com.s10p31a709.game.logelk.entity.GameResult;
import com.s10p31a709.game.logelk.repository.GameResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class GameResultService {

    private final GameResultRepository gameResultRepository;
    private final KafkaProducerService kafkaProducerService;
    private final GameProperties gameProperties;

    public List<GameResult> findAll(){
        Iterable<GameResult> iterable = gameResultRepository.findAll();
        List<GameResult> list = new ArrayList<>();
        for (GameResult item : iterable) {
            list.add(item);
        }
        return list;
    }

    public void save(GameResult gameResult){
        kafkaProducerService.createGameResultDev(gameResult);
    }

    public void sendGameResult(Room room){

        int seeker = 0, hider = 0;
        for (Player player : room.getRoomPlayers()){
            if(player.getIsSeeker()) seeker++;
            else hider ++;
        }

        GameResult gameResult = new GameResult();
        gameResult.setMap(room.getRoomMap());
        gameResult.setIsSeekerWin(room.getRoomState() == 4);
        gameResult.setSeekerCount(seeker);
        gameResult.setHiderCount(hider);
        gameResult.setPlayTime(gameProperties.getTime().getSeek() - room.getRoomTime());

        save(gameResult);
    }



}
