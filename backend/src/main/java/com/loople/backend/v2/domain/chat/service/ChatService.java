package com.loople.backend.v2.domain.chat.service;

import com.loople.backend.v2.domain.chat.dto.*;
import com.loople.backend.v2.domain.chat.entity.ChatText;

import java.util.List;

public interface ChatService {
    ChatRoomResponse buildRoomWithAI(Long userId);
    void saveText(ChatTextRequest chatTextRequest);
    void saveResponse(Long roomId, String response);
    List<ChatbotCategoryResponse> getCategory(String categoryType, Long parentId);
    List<ChatbotCategoryDetailResponse> getDetail(Long parentId, Long userId);

    ChatRoomResponse buildRoom(Long userId, String partner, Long postId);
    List<ChatRoomResponse> getAllRooms(Long userId);
    List<ChatTextResponse> viewRoomText(Long roomId, Long userId);
    void deleteChatRoom(Long roomId, Long userId);

    //WebSocket
    ChatTextResponse saveMessage(ChatTextRequest chatTextRequest);
}
