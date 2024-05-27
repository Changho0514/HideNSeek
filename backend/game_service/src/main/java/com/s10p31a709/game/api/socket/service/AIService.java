package com.s10p31a709.game.api.socket.service;

import com.s10p31a709.game.api.room.entity.Player;
import com.s10p31a709.game.logelk.entity.HideLocation;
import com.s10p31a709.game.logelk.service.HideLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AIService {

    private final HideLocationService hideLocationService;

    public List<Player> hideLocationComputer(int n, String map){
        List<HideLocation> hideLocations = hideLocationService.findN(n, map);

        List<Player> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            HideLocation hideLocation = hideLocations.get(i);
            Player player = new Player();
            player.setSelectedIndex(hideLocation.getSelectedIndex());
            player.setNickname("Computer_"+new Random().nextInt(100000));
            player.setPosition(hideLocation.getPosition());
            player.setDirection(hideLocation.getDirection());
            player.setIsDead(false);
            player.setIsSeeker(false);
            list.add(player);
        }
        return list;
    }

    public List<Player> demonstration(){
        List<Player> list = new ArrayList<>();

        Player com1 = new Player();
        com1.setSelectedIndex(99);
        com1.setNickname("Computer_"+new Random().nextInt(100000));
        com1.setPosition(new Double[]{-24.701041635551533,4.92,32.43351354008555});
        com1.setDirection(new Double[]{0.04158066243329759,0.0,-0.9991351502732791});
        com1.setIsDead(false);
        com1.setIsSeeker(false);
        list.add(com1);

        Player com2 = new Player();
        com2.setSelectedIndex(30);
        com2.setNickname("Computer_"+new Random().nextInt(100000));
        com2.setPosition(new Double[]{33.45538077172444,0.92,5.997428140330845});
        com2.setDirection(new Double[]{-0.9989515314916587,0.0,0.045780320340398604});
        com2.setIsDead(false);
        com2.setIsSeeker(false);
        list.add(com2);

        return list;
    }

}
