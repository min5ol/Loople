package com.loople.backend.v2.domain.chat.service;

import com.loople.backend.v2.domain.chat.dto.ChatRoomResponse;
import com.loople.backend.v2.domain.chat.dto.ChatTextRequest;

public interface ChatService {
    ChatRoomResponse buildRoomWithAI(Long userId);
    void saveText(ChatTextRequest chatTextRequest, Long userId);
    void saveResponse(Long roomId, String response);
}
