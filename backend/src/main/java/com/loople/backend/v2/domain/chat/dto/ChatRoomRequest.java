package com.loople.backend.v2.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatRoomRequest {
    private String participantA;
    private String participantB;
}
