package com.loople.backend.v2.domain.aiChatbot.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRequest {
    private String model;
    private String prompt;
    private float temperature;

    @Builder
    public ChatRequest(String model, String prompt, float temperature) {
        this.model = model;
        this.prompt = prompt;
        this.temperature = temperature;
    }
}
