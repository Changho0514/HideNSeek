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
