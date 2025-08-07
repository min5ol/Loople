package com.loople.backend.v2.domain.chat.service;

import com.loople.backend.v2.domain.chat.dto.*;
import com.loople.backend.v2.domain.chat.entity.*;
import com.loople.backend.v2.domain.chat.repository.*;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatTextRepository chatTextRepository;
    private final UserRepository userRepository;
    private final ChatbotCategoryRepository chatbotCategoryRepository;
    private final ChatbotCategoryDetailRepository chatbotCategoryDetailRepository;
    private final LocalGovernmentWasteInfoRepository localGovernmentWasteInfoRepository;

    //chatbot
    @Override
    public ChatRoomResponse buildRoomWithAI(Long userId) {
        User ById = findById(userId);
        String email = ById.getEmail();
        System.out.println("email = " + email);

        if (email == null || email.isEmpty()) {
            throw new IllegalStateException("사용자 이메일이 존재하지 않습니다.");
        }

        ChatRoom room = chatRoomRepository.findByParticipantAAndParticipantB(email, "AI")
                .orElseGet(() ->
                        chatRoomRepository.save(ChatRoom.builder()
                                .participantA(email)
                                .participantB("AI")
                                .build()));

        return getChatRoomResponse(room);
    }

    @Override
    public void saveText(ChatTextRequest chatTextRequest) {
        ChatText chatText = ChatText.builder()
                .roomId(chatTextRequest.roomId())
                .nickname(chatTextRequest.nickname())
                .content(chatTextRequest.content())
                .createdAt(LocalDateTime.now())
                .build();

        chatTextRepository.save(chatText);
    }

    @Override
    public void saveResponse(Long roomId, String response) {
        ChatText ai = new ChatText(roomId, "AI", response, null, LocalDateTime.now());
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
    public List<ChatbotCategoryDetailResponse> getDetail(Long parentId, Long userId) {
        if (parentId >= 43L && parentId <= 46L) {
            return getLocalInfoUrl(userId);
        }

        if (parentId == 47L) {
            return getLocalInfo(userId);
        }

        List<ChatbotCategoryDetail> byCategoryId = chatbotCategoryDetailRepository.findByCategoryId(parentId);

        return byCategoryId.stream()
                .map(category -> new ChatbotCategoryDetailResponse(category.getInfoType(), category.getContent(), null))
                .collect(Collectors.toList());
    }




    //user
    @Override
    public ChatRoomResponse buildRoom(ChatRoomRequest chatRoomRequest) {
        String participantA = chatRoomRequest.getParticipantA();
        String participantB = chatRoomRequest.getParticipantB();

        // 순서 고정: 항상 사전 순으로 저장
        if (participantA.compareTo(participantB) > 0) {
            String temp = participantA;
            participantA = participantB;
            participantB = temp;
        }

        Optional<ChatRoom> chatRoom = chatRoomRepository.findByParticipantAAndParticipantB(participantA, participantB);

        if (chatRoom.isEmpty()) {
            ChatRoom newRoom = ChatRoom.builder()
                    .participantA(participantA)
                    .participantB(participantB)
                    .updatedAt(LocalDateTime.now())
                    .build();
            chatRoomRepository.save(newRoom);
            return getChatRoomResponse(newRoom);
        } else {
            return getChatRoomResponse(chatRoom.get());
        }
    }

    @Override
    public List<ChatRoomResponse> getAllRooms(String nickname) {
        List<ChatRoom> allByParticipantA = chatRoomRepository.findAllByParticipantA(nickname);
        List<ChatRoom> allByParticipantB = chatRoomRepository.findAllByParticipantB(nickname);

        List<ChatRoom> merged = new ArrayList<>();
        merged.addAll(allByParticipantA);
        merged.addAll(allByParticipantB);

        merged.sort((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()));

        return merged.stream()
                .map(this::getChatRoomResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<ChatTextResponse> viewRoomText(Long roomId) {

        List<ChatText> atDesc = chatTextRepository.findAllByRoomIdOrderByCreatedAtAsc(roomId);
        return atDesc.stream()
                .map(this::getChatTextResponse)
                .collect(Collectors.toList());
    }

    //WebSocket
    @Override
    @Transactional
    public ChatTextResponse saveMessage(ChatTextRequest chatTextRequest) {
        ChatTextRequest chatMessage = chatTextRequest.withTimestamp();
        ChatText chatText = ChatText.builder()
                .roomId(chatMessage.roomId())
                .nickname(chatMessage.nickname())
                .content(chatMessage.content())
                .type(chatMessage.type())
                .createdAt(chatMessage.createdAt())
                .build();

        chatTextRepository.save(chatText);
        ChatRoom chatRoom = chatRoomRepository.findByNo(chatText.getRoomId()).orElseThrow(() -> new NoSuchElementException("해당 채팅방이 존재하지 않습니다."));
        chatRoom.setUpdatedAt(LocalDateTime.now());

        return new ChatTextResponse(chatText.getNo(), chatText.getRoomId(), chatText.getNickname(), chatText.getContent(), chatText.getType(), chatText.getCreatedAt());
    }




    private ChatTextResponse getChatTextResponse(ChatText text){
        return new ChatTextResponse(text.getNo(), text.getRoomId(), text.getNickname(), text.getContent(), text.getType(), text.getCreatedAt());
    }

    private ChatRoomResponse getChatRoomResponse(ChatRoom room) {
        ChatText lastChatText = chatTextRepository.findTopByRoomIdOrderByCreatedAtDesc(room.getNo()).orElse(null);
        String lastContent = lastChatText != null ? lastChatText.getContent() : null;
        return new ChatRoomResponse(room.getNo(), room.getParticipantA(), room.getParticipantB(), lastContent, room.getUpdatedAt());
    }

    private List<ChatbotCategoryDetailResponse> getLocalInfo(Long userId) {
        List<LocalGovernmentWasteInfo> infos = getLocalGovernmentWasteInfos(userId);

        List<LocalGovenmentWasteInfoResponse> localGovernsInfo = infos.stream()
                .map(info -> LocalGovenmentWasteInfoResponse.builder()
                        .sido(info.getSido())
                        .sigungu(info.getSigungu())
                        .homepage(info.getHomepage())
                        .wasteType(info.getWasteType())
                        .disposalTime(info.getDisposalTime())
                        .disposalDays(info.getDisposalDays())
                        .disposalLocation(info.getDisposalLocation())
                        .disposalMethod(info.getDisposalMethod())
                        .build()
                )
                .collect(Collectors.toList());

        return List.of(new ChatbotCategoryDetailResponse("지역별 정보", null, localGovernsInfo));
    }

    private List<ChatbotCategoryDetailResponse> getLocalInfoUrl(Long userId) {
        List<LocalGovernmentWasteInfo> infos = getLocalGovernmentWasteInfos(userId);

        List<LocalGovenmentWasteInfoResponse> localGovernsUrl = infos.stream()
                .map(info -> LocalGovenmentWasteInfoResponse.builder()
                        .sido(info.getSido())
                        .sigungu(info.getSigungu())
                        .homepage(info.getHomepage())
                        .allInfoUrl(info.getAllInfoUrl())
                        .generalUrl(info.getGeneralUrl())
                        .foodUrl(info.getFoodUrl())
                        .recyclingUrl(info.getRecyclingUrl())
                        .bulkyUrl(info.getBulkyUrl())
                        .wasteType(info.getWasteType())
                        .disposalMethod(info.getDisposalMethod())
                        .build()
                )
                .collect(Collectors.toList());

        return List.of(new ChatbotCategoryDetailResponse("지역별 URL", null, localGovernsUrl));
    }

    private List<LocalGovernmentWasteInfo> getLocalGovernmentWasteInfos(Long userId) {
        User byId = findById(userId);
        return localGovernmentWasteInfoRepository.findBySidoAndSigungu(byId.getBeopjeongdong().getSido(),
                byId.getBeopjeongdong().getSigungu());
    }

    private User findById(Long userId) {
        return userRepository.findByNo(userId)
                .orElseThrow(() -> new unFindNoException("존재하지 않는 아이디입니다."));
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)    //예외 발생 시 자동으로 HTTP 상태 코드 401(Unauthorized)로 응답
    public class unFindNoException extends RuntimeException {
        public unFindNoException(String message) {
            super(message); //예외 메시지 부모 클래스(RuntimeException)로 전달
        }
    }
}
