package com.loople.backend.v2.domain.aiChatbot.controller;

import com.loople.backend.v2.domain.aiChatbot.dto.ChatRequest;
import com.loople.backend.v2.domain.aiChatbot.dto.ChatResponse;
import com.loople.backend.v2.domain.aiChatbot.entity.Chatbot;
import com.loople.backend.v2.domain.aiChatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v2/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * [API] ChatGPT 모델 리스트를 조회합니다.
     */
    @GetMapping("/modelList")
    public ResponseEntity<List<Map<String, Object>>> selectModelList() {
        List<Map<String, Object>> result = chatService.modelList();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * [API] ChatGPT 유효한 모델인지 조회합니다.
     *
     * @param modelName
     * @return
     */
    @GetMapping("/model")
    public ResponseEntity<Map<String, Object>> isValidModel(@RequestParam(name = "modelName") String modelName) {
        Map<String, Object> result = chatService.isValidModel(modelName);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * [API] ChatGPT 모델 리스트를 조회합니다.
     */
    @PostMapping("/prompt")
    public ResponseEntity<Map<String, Object>> selectPrompt(@RequestBody ChatRequest completionRequestDto) {
        Map<String, Object> result = chatService.prompt(completionRequestDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
