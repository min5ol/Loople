package com.loople.backend.v2.domain.chat.service;

import com.loople.backend.v2.domain.chat.dto.*;
import com.loople.backend.v2.domain.chat.entity.ChatText;

import java.util.List;

public interface ChatService {
    ChatRoomResponse buildRoomWithAI(String nickname);
    void saveText(ChatTextRequest chatTextRequest);
    void saveResponse(Long roomId, String response);
    List<ChatbotCategoryResponse> getCategory(String categoryType, Long parentId);
    List<ChatbotCategoryDetailResponse> getDetail(Long parentId, Long userId);

    ChatRoomResponse buildRoom(ChatRoomRequest chatRoomRequest, Long postId);
    List<ChatRoomResponse> getAllRooms(String nickname);
    List<ChatTextResponse> viewRoomText(Long roomId, String nickname);
    void deleteChatRoom(Long roomId, String nickname);

    //WebSocket
    ChatTextResponse saveMessage(ChatTextRequest chatTextRequest);
}
