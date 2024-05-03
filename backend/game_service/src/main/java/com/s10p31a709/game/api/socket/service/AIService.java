package com.s10p31a709.game.api.socket.service;

import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.common.config.GameProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AIService {

    private final GameProperties gameProperties;

    public List<Player> createComputer(int n){
        List<Player> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            Player player = new Player();
            player.setSelectedIndex(new Random().nextInt(gameProperties.getObject().getMaxHiderIdx()));
            player.setNickname("Computer_"+new Random().nextInt(100000));
            player.setPosition(new Double[]{i*1d, i*1d, i*1d});
            player.setDirection(new Double[]{i*1d, i*1d, i*1d});
            player.setIsDead(false);
            player.setIsSeeker(false);
        }
        return list;
    }

}
