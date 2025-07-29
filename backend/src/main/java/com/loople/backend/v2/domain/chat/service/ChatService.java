package com.loople.backend.v2.domain.chat.service;

import com.loople.backend.v2.domain.chat.dto.ChatRoomResponse;
import com.loople.backend.v2.domain.chat.dto.ChatTextRequest;
import com.loople.backend.v2.domain.chat.dto.ChatbotCategoryDetailResponse;
import com.loople.backend.v2.domain.chat.dto.ChatbotCategoryResponse;

import java.util.List;

public interface ChatService {
    ChatRoomResponse buildRoomWithAI(Long userId);
    void saveText(ChatTextRequest chatTextRequest, Long userId);
    void saveResponse(Long roomId, String response);
    List<ChatbotCategoryResponse> getCategory(String categoryType, Long parentId);
    List<ChatbotCategoryDetailResponse> getDetail(Long parentId);
}
