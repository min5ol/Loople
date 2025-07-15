package com.loople.backend.v2.domain.aiChatbot.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loople.backend.v2.domain.aiChatbot.config.ChatConfig;
import com.loople.backend.v2.domain.aiChatbot.dto.ChatRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatConfig chatConfig;

    @Value("${openai.api.model}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<Map<String, Object>> modelList() {
        log.debug("[+] 모델 리스트 조회");

        HttpHeaders headers = chatConfig.httpHeaders();

        ResponseEntity<String> response = chatConfig.restTemplate()
                .exchange(
                        "https://api.openai.com/v1/models",
                        HttpMethod.GET,
                        new HttpEntity<>(headers),
                        String.class);

        try {
            Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
            List<Map<String, Object>> resultList = (List<Map<String, Object>>) responseMap.get("data");

            for (Map<String, Object> modelData : resultList) {
                log.debug("ID: {}", modelData.get("id"));
                log.debug("Object: {}", modelData.get("object"));
                log.debug("Created: {}", modelData.get("created"));
                log.debug("Owned By: {}", modelData.get("owned_by"));
            }

            return resultList;
        } catch (JsonProcessingException e) {
            log.error("Error parsing model list response", e);
            throw new RuntimeException("Error parsing model list response", e);
        }
    }

    @Override
    public Map<String, Object> prompt(ChatRequest chatRequest) {
        log.debug("[+] 프롬프트를 수행합니다.");

        HttpHeaders headers = chatConfig.httpHeaders();

        ChatRequest updatedRequest = chatRequest.builder()
                .model(model)
                .temperature(0.8f)
                .build();

        try {
            String requestBody = objectMapper.writeValueAsString(updatedRequest);

            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = chatConfig.restTemplate()
                    .exchange(
                            "https://api.openai.com/v1/completions",
                            HttpMethod.POST,
                            requestEntity,
                            String.class);

            return objectMapper.readValue(response.getBody(), new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            log.error("Error during prompt processing", e);
            throw new RuntimeException("Error during prompt processing", e);
        }
    }

    @Override
    public Map<String, Object> isValidModel(String modelName) {
        log.debug("[+] 모델 유효성 검사: {}", modelName);

        HttpHeaders headers = chatConfig.httpHeaders();

        try {
            ResponseEntity<String> response = chatConfig.restTemplate()
                    .exchange(
                            "https://api.openai.com/v1/models/" + modelName,
                            HttpMethod.GET,
                            new HttpEntity<>(headers),
                            String.class);

            return objectMapper.readValue(response.getBody(), new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            log.error("Error validating model", e);
            throw new RuntimeException("Error validating model", e);
        }
    }
}
