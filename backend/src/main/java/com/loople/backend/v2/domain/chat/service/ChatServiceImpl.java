package com.loople.backend.v2.domain.chat.service;

import com.loople.backend.v2.domain.chat.dto.ChatRoomResponse;
import com.loople.backend.v2.domain.chat.dto.ChatTextRequest;
import com.loople.backend.v2.domain.chat.dto.ChatbotCategoryDetailResponse;
import com.loople.backend.v2.domain.chat.dto.ChatbotCategoryResponse;
import com.loople.backend.v2.domain.chat.entity.ChatRoom;
import com.loople.backend.v2.domain.chat.entity.ChatText;
import com.loople.backend.v2.domain.chat.entity.ChatbotCategory;
import com.loople.backend.v2.domain.chat.entity.ChatbotCategoryDetail;
import com.loople.backend.v2.domain.chat.repository.ChatRoomRepository;
import com.loople.backend.v2.domain.chat.repository.ChatTextRepository;
import com.loople.backend.v2.domain.chat.repository.ChatbotCategoryDetailRepository;
import com.loople.backend.v2.domain.chat.repository.ChatbotCategoryRepository;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService{

    private final ChatRoomRepository chatRoomRepository;
    private final ChatTextRepository chatTextRepository;
    private final UserRepository userRepository;
    private final ChatbotCategoryRepository chatbotCategoryRepository;
    private final ChatbotCategoryDetailRepository chatbotCategoryDetailRepository;

    @Override
    public ChatRoomResponse buildRoomWithAI(Long userId) {
        User emailById = findEmailById(userId);
        String email = emailById.getEmail();
        System.out.println("email = " + email);

        if(email == null || email.isEmpty()) {
            throw new IllegalStateException("사용자 이메일이 존재하지 않습니다.");
        }

        ChatRoom room = chatRoomRepository.findByParticipantAAndParticipantB(email, "AI")
                .orElseGet(() ->
                        chatRoomRepository.save(ChatRoom.builder()
                                .participantA(email)
                                .participantB("AI")
                                .isDeleted(0)
                                .build()));

        return new ChatRoomResponse(room.getNo(), room.getParticipantA(), room.getParticipantB());
    }

    @Override
    public void saveText(ChatTextRequest chatTextRequest, Long userId) {
        User emailById = findEmailById(userId);

        ChatText chatText = ChatText.builder()
                .roomId(chatTextRequest.getRoomId())
                .userEmail(emailById.getEmail())
                .content(chatTextRequest.getContent())
                .build();

        chatTextRepository.save(chatText);

    }

    @Override
    public void saveResponse(Long roomId, String response) {
        ChatText ai = new ChatText(roomId, "AI", response);
        chatTextRepository.save(ai);
    }

    @Override
    public List<ChatbotCategoryResponse> getCategory(String categoryType, Long parentId) {
        List<ChatbotCategory> mainCategory = chatbotCategoryRepository.findByCategoryTypeAndParentId(categoryType, parentId);

        return mainCategory.stream()
                .map(category -> new ChatbotCategoryResponse(category.getNo(), category.getCategoryType(), category.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ChatbotCategoryDetailResponse> getDetail(Long parentId) {
        if(parentId == 15L) {
            //지역별 정보
            //링크, 수거시간, 장소만 간단하게 보여주고 자세한 사항은 홈페이지 참조 
        }
        
        List<ChatbotCategoryDetail> byCategoryId = chatbotCategoryDetailRepository.findByCategoryId(parentId);

        return byCategoryId.stream()
                .map(category -> new ChatbotCategoryDetailResponse(category.getInfoType(), category.getContent()))
                .collect(Collectors.toList());
    }

    private User findEmailById(Long userId){
        return userRepository.findEmailByNo(userId)
                .orElseThrow(() -> new unFindNoException("존재하지 않는 아이디입니다."));
    }


    @ResponseStatus(HttpStatus.UNAUTHORIZED)    //예외 발생 시 자동으로 HTTP 상태 코드 401(Unauthorized)로 응답
    public class unFindNoException extends RuntimeException {
        public unFindNoException(String message) {
            super(message); //예외 메시지 부모 클래스(RuntimeException)로 전달
        }
    }
}
