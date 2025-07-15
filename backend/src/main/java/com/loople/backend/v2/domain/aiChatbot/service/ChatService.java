package com.loople.backend.v2.domain.aiChatbot.service;

import com.loople.backend.v2.domain.aiChatbot.dto.ChatRequest;

import java.util.List;
import java.util.Map;

public interface ChatService {
    List<Map<String, Object>> modelList();
    Map<String, Object> prompt(ChatRequest chatRequest);
    Map<String, Object> isValidModel(String modelName);
}
