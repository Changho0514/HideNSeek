# 포팅 가이드라인

이 문서는 `숨구멍` 서비스 `Front`, `Back`, `Infra`의 빌드 및 배포를 위한 문서입니다.

# 프로젝트 버전 정보

| Infra    | OS            | Ubuntu             | 20.04.6    |
| -------- |---------------|--------------------|------------|
|          | Container     | Docker             | 26.1.3     |
|          |               | Docker-compose     | 1.29.2     |
|          | CI/CD         | Jenkins            | 2.452.1    |
|          | CI/CD         | argoCD             | 6.7.15     |
|          | Ingress       | nginx-ingress      | 4.10.1     |
| Backend  | Java          | Corretto-17        | 17.0.10    |
|          | Spring        | Spring Boot        | 3.2.4      |
|          |               | Spring Cloud       | 2023.0.0   |
|          |               | Lombok             | 1.18.30    |
|          |               | Springdoc-open api | 2.2.0      |
|          | Build         | Gradle             | 8.7-bin    |
| Frontend | JavaScript    | Node.js            | 18.19.0    |
|          | Package Mgr   | npm                | 10.2.4     |
|          | Framework     | React              | 18.2.0     |
|          | Build         | Vite               | 5.2.0      |
|          | TypeScript    | TypeScript         | 5.2.2      |
|          | State Mgt     | Redux              | 2.2.3      |
| Database | RDBMS         | MariaDB            | 11.2       |
| Infra    | Container     | Kubernetes         | 1.29       |
|          | CLI           | aws-cli            | 2.15.40    |


---

# ubuntu 배포 설정

- 배포 환경은 `Ubuntu 20.04.6`을 사용합니다.

## HTTPS 인증 (Certbot)

docker nginx를 사용하기 전에 https 인증을 위해서 일단 nginx를 설치하고 https 인증 이후 삭제합니다.

1. Certbot 설치

   ```bash
   $ apt-get update
   $ sudo apt-get install certbot
   $ apt-get install python-certbot-nginx
   ```

2. NGINX SSL 설정

   ```bash
   server {
       listen 80 default_server;
       listen [::]:80 default_server;
       root /var/www/html;
       server_name {{domain_name}} # ex) k10a709.p.ssafy.io;
   }
   ```

3. Nginx 재시작

   ```bash
   $ sudo service nginx restart
   ```

4. SSL 인증서 받기

   ```bash
   sudo certbot --nginx -d {{domain_name}} -d {{sub_domain_name}} # 우리조의 경우 p.ssafy.io로 받게 되었습니다.
   ```

   인증서 인증시 개인 이메일이 필요합니다.

5. 로컬 Nginx 완전 삭제

   ```bash
   sudo apt-get -y remove --purge nginx nginx-full nginx-common
   ```

   인증 완료 후 docker nginx 사용을 위해서 nginx를 완전히 삭제해 줍니다.

## Docker Nginx 설정

Docker Nginx 설정 파일은 프로젝트 폴더 `/default.conf` 에 위치해 있습니다.+

```bash
server {
  listen 80;
  server_name k10a709.p.ssafy.io;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  server_name k10a709.p.ssafy.io;

  ssl_certificate /etc/letsencrypt/live/{{domain.name}}/fullchain.pem; 
  ssl_certificate_key /etc/letsencrypt/live/{{domain.name}}/privkey.pem; 

  ssl_protocols TLSv1.2;
  ssl_prefer_server_ciphers on;

  location /api/member-service {
          proxy_pass http://172.17.0.1:8001;
          proxy_set_header Host $http_host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
        }
  location /api/game-service {
          proxy_pass http://172.17.0.1:8002;
          proxy_set_header Host $http_host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
        }

 location /ws {
          proxy_pass http://172.17.0.1:4000;
          proxy_http_version 1.1;
          proxy_set_header    Upgrade             $http_upgrade;
          proxy_set_header    Connection          'upgrade';
          proxy_set_header    Host                $host;
          proxy_cache_bypass                      $http_upgrade;
        }
        
	location / {
	  proxy_pass http://172.17.0.1:8081;
	  proxy_set_header Host $http_host;
	  proxy_set_header X-Real-IP $remote_addr;
	  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	  proxy_set_header X-Forwarded-Proto $scheme;
	}
}

```

백엔드 docker container 이름, 도메인 이름을 자신의 서버 환경에 맞게 변경해 줍니다.

## Dockerfile 설정

Front 빌드 및 배포를 위한 도커 파일은 프로젝트내 `frontend/Dockerfile` 에 위치하여 있습니다.

```docker
FROM node:18.19.0 as builder
WORKDIR /app
ENV REACT_APP_ALLOW ALLOW
COPY package*.json .
RUN npm ci
COPY . .
RUN ls -al
RUN npm run build

FROM nginx:latest
WORKDIR /usr/share/nginx/statics
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

```


---

# Backend 빌드 및 배포 설정


# game_service 서버 설정

파일경로: `backend/game_service/src/main/resources/application.yml`

- **application.yml (game_service)**

```yaml
server:
  port: 8002
  domain: ${SERVER_DOMAIN:https://k10a709.p.ssafy.io}
  servlet:
    contextPath: "/api/game-service"
    encoding:
      charset: UTF-8
      enabled: true
      force: true
  count: 4
spring:
  application:
    name: game-service
  devtools:
    livereload:
      enabled: true
  kafka:
    bootstrap-servers: k10a709.p.ssafy.io:19092
  elasticsearch:
    uris: http://k10a709.p.ssafy.io:9200
#logging
logging:
  level:
    org:
      springframework:
        messaging: INFO
        web:
          socket: INFO
      hibernate.orm.jdbc.bind: TRACE
    com.s10p31a709.game.common.aop: INFO

game:
  time:
    waiting: 3
    hide: 30
    seek: 120
    result: 10
  maxCapacity: 12
  richRoom:
    maxSeekerIdx: 14
    maxHiderIdx: 101
    startPoint: -43.8823, 0.03, -27.9526
    maxMapValue: 1
  farm:
    maxSeekerIdx: 14
    maxHiderIdx: 49
    startPoint: 0.0, 0.03, 0.0
    maxMapValue: 100
  fps: 30  
```

### Dockerfile 설정

Back 빌드 및 배포를 위한 도커 파일은 프로젝트내 `game_service/Dockerfile` 에 위치하여 있습니다.

```docker
# 빌드 스테이지
FROM gradle:8.7-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon

# 패키지 스테이지
FROM openjdk:17-jdk
EXPOSE 8002
COPY --from=build /home/gradle/src/build/libs/*.jar /app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

# Member_service 서버 설정

파일경로: `backend/member_service/src/main/resources/application.yml`

- **application.yml (member_service)**

```yaml
# 빌드 스테이지
FROM gradle:8.7-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon

# 패키지 스테이지
FROM openjdk:17-jdk
EXPOSE 8002
COPY --from=build /home/gradle/src/build/libs/*.jar /app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
  
```

### Dockerfile 설정

Back 빌드 및 배포를 위한 도커 파일은 프로젝트내 `member_service/Dockerfile` 에 위치하여 있습니다.

```docker
# 빌드 스테이지
FROM gradle:8.7-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon

# 패키지 스테이지
FROM openjdk:17-jdk
EXPOSE 8002
COPY --from=build /home/gradle/src/build/libs/*.jar /app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

---






# Server 설정

## docker 설치

1. 우분투 시스템 패키지 업데이트

   ```bash
   $ sudo apt-get update
   ```

2. 도커 설치에 필요한 패키지 설치

   ```bash
   $ sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
   ```

3. Docker 공식 GPG 설치

   ```bash
   $ curl -fsSL <https://download.docker.com/linux/ubuntu/gpg> | sudo apt-key add -
   ```

4. Docker의 공식 apt 저장소를 추가

   ```bash
   $ sudo add-apt-repository "deb [arch=amd64] <https://download.docker.com/linux/ubuntu> $(lsb_release -cs) stable"
   ```

5. 시스템 패키지 업데이트

   ```bash
   $ sudo apt-get update
   ```

6. Docker 설치

   ```bash
   $ sudo apt-get install docker-ce docker-ce-cli containerd.io
   ```

7. Docker 설치 확인

   ```bash
   $ sudo systemctl status docker
   $ docker -v
   ```

## docker-compose 설치

1. Docker-compose 설치

   ```bash
   $ sudo curl -SL "<https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$>(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   ```

   - docker-compose yml 3.0 이상을 사용할 경우 2.0.0 이상의 docker-compose를 설치해야 한다.

2. Docker-compose 권한 부여

   ```bash
   $ sudo chmod +x /usr/local/bin/docker-compose
   ```

3. Docker-compose 심볼릭 링크 지정

   ```bash
   $ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
   ```

4. docker-compose 버전 확인

   ```bash
   $ docker-compose --version
   ```

---

## docker-compose.yml 작성

프로젝트 가장 상위에 `docker-compose.yml` 파일을 생성합니다.

```yaml
version: '3'
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /default.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - game_service
      - member_service
      - frontend
    restart: always

  member_service:
    build:
      context: ./backend/member_service
      dockerfile: Dockerfile
    image: choichangho514/backend_member_service
    ports:
      - "8001:8001"
    restart: always

  game_service:
    build:
      context: ./backend/game_service
      dockerfile: Dockerfile
    image: choichangho514/backend_game_service
    ports:
      - "8002:8002"
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    image: choichangho514/frontend
    ports:
      - "8081:80"
    restart: always

networks:
  default:
    driver: bridge

```

