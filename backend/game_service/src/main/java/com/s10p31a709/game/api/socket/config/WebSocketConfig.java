package com.s10p31a709.game.api.socket.config;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	@Value("${server.count}")
	private int serverCount;

	@Override
	public void registerStompEndpoints(StompEndpointRegistry endpointRegistry) {
		endpointRegistry.addEndpoint("/ws")
				.setAllowedOriginPatterns("*");
//				.withSockJS();
		for(int i = 1; i <= serverCount; i++){
			String path = "/ch/" + i + "/ws";
			endpointRegistry.addEndpoint(path)
				.setAllowedOriginPatterns("*");
		}
		// endpointRegistry.addEndpoint("/ch/1/ws")
		// 	.setAllowedOriginPatterns("*");
		// endpointRegistry.addEndpoint("/ch/2/ws")
		// 	.setAllowedOriginPatterns("*");
		// endpointRegistry.addEndpoint("/ch/3/ws")
		// 	.setAllowedOriginPatterns("*");
		// endpointRegistry.addEndpoint("/ch/4/ws")
		// 	.setAllowedOriginPatterns("*");
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry brokerRegistry) {
		brokerRegistry.enableSimpleBroker("/sub");
		brokerRegistry.setApplicationDestinationPrefixes("/");
	}

}
