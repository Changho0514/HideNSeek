package com.s10p31a709.member.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.s10p31a709.member.common.exception.CustomException;
import com.s10p31a709.member.entity.Channel;
import com.s10p31a709.member.entity.Member;
import com.s10p31a709.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChannelService {
    @Value("${server.count}")
    private int channelCount;

    private final KubeGameServiceClient kubeGameServiceClient;

    public List<Channel> getChannel(){
        List<Channel> list = new ArrayList<>();
        for (int i = 0; i < channelCount; i++) {
            list.add(kubeGameServiceClient.channelInfoKube(i + 1));
        }
        return list;
    }

}
