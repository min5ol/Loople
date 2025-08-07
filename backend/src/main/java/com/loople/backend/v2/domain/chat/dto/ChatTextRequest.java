package com.loople.backend.v2.domain.chat.dto;

import com.loople.backend.v2.domain.chat.entity.MessageType;
import java.time.LocalDateTime;

public record ChatTextRequest (Long roomId, Long userId, String nickname, String content, MessageType type, LocalDateTime createdAt) {

    // JDK 21의 레코드 기능으로 간결한 데이터 클래스 정의
    public ChatTextRequest withTimestamp() {
        System.out.println("LocalDateTime.now() = " + LocalDateTime.now());
        return new ChatTextRequest(roomId, userId, nickname, content, type, LocalDateTime.now());
    }

}