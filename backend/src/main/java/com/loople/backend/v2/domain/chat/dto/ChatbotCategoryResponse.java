package com.loople.backend.v2.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatbotCategoryResponse {
    private Long no;
    private String categoryType;
    private String name;
}
