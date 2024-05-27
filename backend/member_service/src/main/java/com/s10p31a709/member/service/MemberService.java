package com.s10p31a709.member.service;

import com.s10p31a709.member.common.exception.CustomException;
import com.s10p31a709.member.entity.Member;
import com.s10p31a709.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayDeque;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {

    @Value("${server.domain}")
    private String domain;
    @Value("${server.count}")
    private int serverCount;

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final GameServiceClient gameServiceClient;
    private final KubeGameServiceClient kubeGameServiceClient;

    public Member getMember(String nickname){
        return memberRepository.findByNickname(nickname, Member.class).orElseThrow(() -> new CustomException(404, "존재하지 않는 아이디 입니다"));
    }

    public Member login(String nickname, String password){
        Member member = memberRepository.findByNickname(nickname, Member.class).orElseThrow(() -> new CustomException(404, "존재하지 않는 아이디 입니다"));
        boolean isMatch = bCryptPasswordEncoder.matches(password, member.getPassword());
        if(!isMatch) throw new CustomException(400, "비밀번호가 일치하지 않습니다");

        return member;
    }

    public Member guestLogin(String nickname){
        Member member = memberRepository.findByNickname(nickname, Member.class).orElse(null);
        if (member != null) throw new CustomException(409, "이미 사용중인 닉네임 입니다");
        member = memberRepository.save(new Member(nickname, ""));
        return member;
    }

    public Member registerMember(String nickname, String password){
        Member member = memberRepository.findByNickname(nickname, Member.class).orElse(null);
        if (member != null) {
            throw new CustomException(400, "이미 존재하는 아이디 입니다.");
        }
        password = bCryptPasswordEncoder.encode(password);
        return memberRepository.save(new Member(nickname, password));
    }

    @Transactional
    public void deleteMember(String nickname){
        Member member = memberRepository.findByNickname(nickname, Member.class).orElseThrow(() -> new CustomException(404, "유저를 찾을 수 없습니다"));
        memberRepository.delete(member);
    }

    @Transactional
    public void deleteGuest(String nickname){
        Member member = memberRepository.findByNickname(nickname, Member.class).orElse(null);
        if(member != null && member.getPassword().isEmpty()) memberRepository.delete(member);
    }

    @Transactional
    public void heartbeat(String nickname){
        Member member = memberRepository.findByNickname(nickname, Member.class).orElseThrow(() -> new CustomException(400, "로그인 되어 있지 않은 게스트 입니다."));

        member.setUpdatedTime(LocalDateTime.now());
    }

    @Scheduled(fixedRate = 5000)
    public void checkConnectMember(){
        List<Member> list = memberRepository.findAll();

        for(Member member : list){
            if(!member.getPassword().isEmpty()) continue;

            LocalDateTime now = LocalDateTime.now();
            Duration duration = Duration.between(now, member.getUpdatedTime());
            if (Math.abs(duration.getSeconds()) > 75){
                deleteGuest(member.getNickname());
                log.info("heartbeat 시간만료: {}", member);

                // game-service에서 해당 플레이어 삭제 처리
                try {
                    if(domain.contains("hidebowwow")){
                        for(int i = 1; i <= serverCount; i++) {
                            kubeGameServiceClient.deletePlayer(i, member.getNickname());
                        }
                    }
                    else gameServiceClient.deletePlayer(member.getNickname());
                }catch (Exception e){
                    log.info(e.toString());
                }

            }

        }


    }

}
