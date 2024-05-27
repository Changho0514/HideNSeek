## Kafka+ELK(Kafka, ElasticSearch, Logstash,Kibana) 포팅 메뉴얼

### Kafka+ ELK 컨테이너 실행

```
# git clone 
git clone https://lab.ssafy.com/s10-final/S10P31A709.git

# docker-elk 폴더로 이동
cd S10P31A709/backend/log_service/docker-elk


# docker-compose 파일 실행
docker compose up -d --build 
```


### ElasticSearch, Kibana 사이트 접속

```
`elasticsearch` : http://k10a709.p.ssafy.io:9200 
- 사용자: elastic
- 비번: changeme

`kibana` : http://k10a709.p.ssafy.io:5601 
- 사용자: elastic
- 비번: changeme

`kafka manager` : http://k10a709.p.ssafy.io:9000 
- 아무 클러스터 만든다음 토픽 > 리스트에서 생성된 토픽 확인
```
