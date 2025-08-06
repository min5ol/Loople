package com.loople.backend.v2.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatTextRequest {
    private Long userId;
    private String nickname;
    private Long roomId;
    private String content;
    private String type;
}
