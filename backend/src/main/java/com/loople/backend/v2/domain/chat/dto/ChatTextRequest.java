package com.loople.backend.v2.domain.chat.dto;

import com.loople.backend.v2.domain.chat.entity.MessageType;
import java.time.LocalDateTime;

public record ChatTextRequest (Long roomId, Long userId, String nickname, String content, MessageType type, LocalDateTime createdAt) {


}