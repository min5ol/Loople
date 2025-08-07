package com.loople.backend.v2.domain.chat.dto;

import com.loople.backend.v2.domain.chat.entity.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ChatTextResponse {
    private Long no;
    private Long roomId;
    private String nickname;
    private String content;
    private MessageType type;
    private LocalDateTime createdAt;
}
