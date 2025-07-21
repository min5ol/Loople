package com.loople.backend.v2.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatTextRequest {
    private Long roomId;
    private String userEmail;
    private String content;
}
