package com.loople.backend.v2.domain.chat.service;

import com.loople.backend.v2.domain.chat.dto.*;
import com.loople.backend.v2.domain.chat.entity.*;
import com.loople.backend.v2.domain.chat.repository.*;
import com.loople.backend.v2.domain.community.entity.CommunityBoards;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import com.loople.backend.v2.domain.community.repository.CommunityBoardsRepository;
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
    private final CommunityBoardsRepository communityBoardsRepository;

    //chatbot
    @Override
    public ChatRoomResponse buildRoomWithAI(String nickname) {
        ChatRoom room = chatRoomRepository
                .findByParticipantAAndParticipantBAndPostId(nickname, "AI", null)
                .orElseGet(() -> chatRoomRepository.save(ChatRoom.builder()
                        .participantA(nickname)
                        .participantB("AI")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()));

        return getChatRoomResponse(room, null);
    }

    @Override
    public void saveText(ChatTextRequest chatTextRequest) {
        ChatText chatText = ChatText.builder()
                .roomId(chatTextRequest.roomId())
                .nickname(chatTextRequest.nickname())
                .content(chatTextRequest.content())
                .type(chatTextRequest.type())
                .createdAt(LocalDateTime.now())
                .build();

        chatTextRepository.save(chatText);
    }

    @Override
    public void saveResponse(Long roomId, String response) {
        ChatText ai = new ChatText(roomId, "AI", response, MessageType.CHAT, LocalDateTime.now(), true, true);
        chatTextRepository.save(ai);
    }

    @Override
    public List<ChatbotCategoryResponse> getCategory(String categoryType, Long parentId) {
        List<ChatbotCategory> category = chatbotCategoryRepository.findByCategoryTypeAndParentId(categoryType, parentId);

        return category.stream()
                .map(cat -> new ChatbotCategoryResponse(cat.getNo(), cat.getCategoryType(), cat.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ChatbotCategoryDetailResponse> getDetail(Long parentId, Long userId) {
        if (parentId >= 43L && parentId <= 47L) { return getLocalInfo(userId); }

        List<ChatbotCategoryDetail> byCategoryId = chatbotCategoryDetailRepository.findByCategoryId(parentId);

        return byCategoryId.stream()
                .map(category -> new ChatbotCategoryDetailResponse(category.getInfoType(), category.getContent(), null))
                .collect(Collectors.toList());
    }


    //user
    @Override
    @Transactional
    public ChatRoomResponse buildRoom(ChatRoomRequest chatRoomRequest, Long postId) {
        String participantA = chatRoomRequest.getParticipantA();
        String participantB = chatRoomRequest.getParticipantB();

        // 순서 고정: 항상 사전 순으로 저장
        if (participantA.compareTo(participantB) > 0) {
            String temp = participantA;
            participantA = participantB;
            participantB = temp;
        }

        Optional<ChatRoom> chatRoom = chatRoomRepository.findByParticipantAAndParticipantBAndPostId(participantA, participantB, postId);

        if (chatRoom.isEmpty()) {
            ChatRoom newRoom = ChatRoom.builder()
                    .postId(postId)
                    .participantA(participantA)
                    .participantB(participantB)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            chatRoomRepository.save(newRoom);

            return getChatRoomResponse(newRoom, null);

        } else {
            boolean amIA = isMeA(participantA, chatRoom.get());    //participantA로 들어온 사용자가 저장된 채팅방의 A 유저냐

            if (amIA) {
                chatRoom.get().setALeft(false);
            } else {
                chatRoom.get().setBLeft(false);
            }

            ChatText lastChatText = getLastChatText(chatRoom.get());
            return getChatRoomResponse(chatRoom.get(), lastChatText);

        }
    }

    @Override
    public List<ChatRoomResponse> getAllRooms(String nickname) {
        List<ChatRoom> allByParticipantA = chatRoomRepository.findAllByParticipantAAndALeftFalse(nickname);
        List<ChatRoom> allByParticipantB = chatRoomRepository.findAllByParticipantBAndBLeftFalse(nickname);

        List<ChatRoom> merged = new ArrayList<>();
        merged.addAll(allByParticipantA);
        merged.addAll(allByParticipantB);

        merged.sort((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()));


        return merged.stream()
                .filter(chatRoom -> !chatRoom.getParticipantB().equals("AI"))
                .map(chatRoom -> getChatRoomResponse(chatRoom, getLastChatText(chatRoom)))
                .collect(Collectors.toList());
    }


    @Override
    public List<ChatTextResponse> viewRoomText(Long roomId, String nickname) {
        ChatRoom room = chatRoomRepository.findByNo(roomId).orElseThrow(() -> new NoSuchElementException("채팅방 정보 없음"));

        boolean amIA = isMeA(nickname, room);
        List<ChatText> atDesc;

        if (amIA) {
            atDesc = chatTextRepository.findAllByRoomIdAndVisibleATrueOrderByCreatedAtAsc(roomId);
        } else {
            atDesc = chatTextRepository.findAllByRoomIdAndVisibleBTrueOrderByCreatedAtAsc(roomId);
        }

        return atDesc.stream()
                .map(this::getChatTextResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteChatRoom(Long roomId, String nickname) {
        ChatRoom room = chatRoomRepository.findByNo(roomId).orElseThrow(() -> new NoSuchElementException("채팅방 정보 없음"));

        boolean amIA = isMeA(nickname, room);

        if (amIA) {
            room.setALeft(true);
            List<ChatText> chatTexts = chatTextRepository.findAllByRoomIdAndVisibleATrueOrderByCreatedAtAsc(room.getNo());
            chatTexts.forEach(text -> text.setVisibleA(false));
        } else {
            room.setBLeft(true);
            List<ChatText> chatTexts = chatTextRepository.findAllByRoomIdAndVisibleBTrueOrderByCreatedAtAsc(room.getNo());
            chatTexts.forEach(text -> text.setVisibleB(false));
        }

    }

    private static boolean isMeA(String nickname, ChatRoom room) {
        return room.getParticipantA().equals(nickname);
    }


    //WebSocket
    @Override
    @Transactional
    public ChatTextResponse saveMessage(ChatTextRequest chatTextRequest) {
        System.out.println("chatTextRequest = " + chatTextRequest);

        ChatText chatText = ChatText.builder()
                .roomId(chatTextRequest.roomId())
                .nickname(chatTextRequest.nickname())
                .content(chatTextRequest.content())
                .type(chatTextRequest.type())
                .createdAt(chatTextRequest.createdAt())
                .visibleA(true)
                .visibleB(true)
                .build();

        ChatRoom chatRoom = chatRoomRepository.findByNo(chatText.getRoomId()).orElseThrow(() -> new NoSuchElementException("해당 채팅방이 존재하지 않습니다."));

        boolean amIA = isMeA(chatTextRequest.nickname(), chatRoom);

        if (amIA) {
            if (chatRoom.isBLeft()) {
                chatRoom.setBLeft(false);
            }
        } else {
            if (chatRoom.isALeft()) {
                chatRoom.setALeft(false);
            }
        }

        chatTextRepository.save(chatText);
        chatRoom.setUpdatedAt(LocalDateTime.now());

        return new ChatTextResponse(chatText.getNo(), chatText.getRoomId(), chatText.getNickname(), chatText.getContent(), chatText.getType(), chatText.getCreatedAt());
    }


    private ChatTextResponse getChatTextResponse(ChatText text) {
        return new ChatTextResponse(text.getNo(), text.getRoomId(), text.getNickname(), text.getContent(), text.getType(), text.getCreatedAt());
    }

    private ChatRoomResponse getChatRoomResponse(ChatRoom room, ChatText lastChatText) {
        String lastContent = "";
        String title = "";
        if (room.getPostId() != null) {
            CommunityBoards communityBoards = communityBoardsRepository.findByNo(room.getPostId())
                    .orElseThrow(() -> new NoSuchElementException("해당 게시글은 삭제되었습니다."));

            lastContent = lastChatText != null ? lastChatText.getContent() : null;
            title = communityBoards.getTitle();
        }
        return new ChatRoomResponse(room.getNo(), room.getPostId(), title,
                room.getParticipantA(), room.getParticipantB(), lastContent, room.getUpdatedAt());
    }

    private ChatText getLastChatText(ChatRoom room) {
        Optional<ChatText> lastChatText = chatTextRepository.findTopByRoomIdOrderByCreatedAtDesc(room.getNo());
        return lastChatText.orElse(null);
    }


    private List<ChatbotCategoryDetailResponse> getLocalInfo(Long userId) {
        List<LocalGovernmentWasteInfo> infos = getLocalGovernmentWasteInfos(userId);

        List<LocalGovenmentWasteInfoResponse> localGovernsInfo = infos.stream()
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
                        .disposalTime(info.getDisposalTime())
                        .disposalDays(info.getDisposalDays())
                        .disposalLocation(info.getDisposalLocation())
                        .disposalMethod(info.getDisposalMethod())
                        .build()
                )
                .collect(Collectors.toList());

        return List.of(new ChatbotCategoryDetailResponse("지역별 정보", null, localGovernsInfo));
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
