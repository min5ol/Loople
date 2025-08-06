package com.loople.backend.v2.domain.chat.service;

import com.loople.backend.v2.domain.chat.dto.*;

import java.util.List;

public interface ChatService {
    ChatRoomResponse buildRoomWithAI(Long userId);
    void saveText(ChatTextRequest chatTextRequest);
    void saveResponse(Long roomId, String response);
    List<ChatbotCategoryResponse> getCategory(String categoryType, Long parentId);
    List<ChatbotCategoryDetailResponse> getDetail(Long parentId, Long userId);

    ChatRoomResponse buildRoom(ChatRoomRequest chatRoomRequest);
    List<ChatRoomResponse> getAllRooms(String nickname);
    ChatTextResponse sendMessage(ChatTextRequest chatTextRequest);
    List<ChatTextResponse> viewRoomText(Long roomId);
}
