package com.loople.backend.v2.domain.chat.controller;

import com.loople.backend.v2.global.api.OpenApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v2/chat")
@RequiredArgsConstructor
public class ChatController {

    private final OpenApiClient openApiClient;

    // POST 방식으로 메시지 받아 OpenAI 응답 반환
    @PostMapping(value = "/completion")
    public Mono<String> chatWithAI(@RequestBody String userMessage){
        return openApiClient.requestChatCompletion(userMessage);
    }
}