package com.loople.backend.v2.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatRoomResponse {
    private Long no;
    private Long postId;
    private String postTitle;
    private String participantA;
    private String participantB;
    private String lastMessage;
    private LocalDateTime updatedAt;
}
