package com.loople.backend.v2.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChatbotCategoryDetailResponse {
    private String infoType;
    private String content;
    private List<LocalGovenmentWasteInfoResponse> localGovern;
}
