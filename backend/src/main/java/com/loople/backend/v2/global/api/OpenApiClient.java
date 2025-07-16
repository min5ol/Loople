package com.loople.backend.v2.global.api;

import com.loople.backend.v2.global.api.dto.OpenApiRequest;
import com.loople.backend.v2.global.api.dto.OpenApiResponse;
import com.loople.backend.v2.global.api.dto.Message;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class OpenApiClient {
    private WebClient webClient;

    @Value("${openai.api.key}")
    private String secretKey;

    @Value("${openai.api.base-url}")
    private String apiUrl;

    @Value("${openai.api.model}")
    private String model;

    private final WebClient.Builder webClientBuilder;

    public OpenApiClient(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @PostConstruct
    public void init(){
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }

    public Mono<String> requestChatCompletion(@RequestBody String userMessage){
        OpenApiRequest requestBody = new OpenApiRequest(
                model,
                new Message[]{ new Message("user", userMessage) },
                0.7f
        );

        return webClient.post()
                .header("Authorization", "Bearer " + secretKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(OpenApiResponse.class)
                .map(response -> response.getChoices()[0].getMessage().getContent());
    }

}
