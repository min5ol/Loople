package com.loople.backend.v2.domain.chat.controller;

import com.loople.backend.v2.domain.chat.dto.*;
import com.loople.backend.v2.domain.chat.service.ChatService;
import com.loople.backend.v2.global.api.OpenApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v2/chat/completion")
@RequiredArgsConstructor
public class ChatController {

    private final OpenApiClient openApiClient;
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // POST 방식으로 메시지 받아 OpenAI 응답 반환
    @PostMapping("/chatbot/text")
    public Mono<String> sendMessageToAI(@RequestBody ChatTextRequest chatTextRequest){
        System.out.println("chatTextRequest = " + chatTextRequest);
        String prompt = chatTextRequest.content()
                + " 쓰레기 처리 방법에 대해 알려줘 !\n"
                + "두괄식으로 어떻게 할지 먼저 써주고 그 뒤에 설명 붙여줘\n"
                + "줄글의 형식으로 보여주며 줄바꿈 적용해서 가독성 있게 답장 부탁해";

        return openApiClient.requestChatCompletion(prompt)
                .flatMap(AIResponse -> {
                    //보낸 메시지 저장
                    chatService.saveText(chatTextRequest);

                    //응답 메시지 저장
                    chatService.saveResponse(chatTextRequest.roomId(), AIResponse);
                    return Mono.just(AIResponse);
                });
    }

    @GetMapping("/chatbot/buildRoom/{nickname}")
    public ChatRoomResponse getRoomNum(@PathVariable String nickname){
        return chatService.buildRoomWithAI(nickname);
    }

    @GetMapping("/chatbot/category")
    public List<ChatbotCategoryResponse> getMainCategory(@RequestParam String categoryType, @RequestParam(required=false) Long parentId){
        System.out.println("categoryType = " + categoryType);
        return chatService.getCategory(categoryType, parentId);
    }

    @GetMapping("/chatbot/details")
    public List<ChatbotCategoryDetailResponse> getDetails(@RequestParam Long parentId, @RequestParam Long userId){
        return chatService.getDetail(parentId, userId);
    }

    @PostMapping("user/buildRoom/{postId}")
    public ChatRoomResponse getRoomListByUser(@RequestBody ChatRoomRequest chatRoomRequest, @PathVariable Long postId){
        return chatService.buildRoom(chatRoomRequest, postId);
    }

    @GetMapping("user/allRoom/{nickname}")
    public List<ChatRoomResponse> getAllRooms(@PathVariable String nickname){
        return chatService.getAllRooms(nickname);
    }

    @GetMapping("/user/{roomId}/text")
    public List<ChatTextResponse> viewRoomText(@PathVariable Long roomId, @RequestParam String nickname){
        return chatService.viewRoomText(roomId, nickname);
    }

    @GetMapping("/user/delete/{roomId}")
    public void deleteChatRoom(@PathVariable Long roomId, @RequestParam String nickname) {
        chatService.deleteChatRoom(roomId, nickname);
    }


    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public void sendMessage(@Payload ChatTextRequest chatTextRequest) {
        System.out.println("chatTextRequest = " + chatTextRequest);

        // JDK 21의 가상 스레드를 사용하여 비동기적으로 메시지 처리
        Thread.ofVirtual()
                .name("chat-process-" + System.currentTimeMillis())
                .start(() -> {
                    ChatTextResponse response = chatService.saveMessage(chatTextRequest);
                    messagingTemplate.convertAndSend("/topic/public", response);
                });

    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatTextRequest addUser(@Payload ChatTextRequest chatTextRequest,
                                   SimpMessageHeaderAccessor headerAccessor) {

        String nickname = chatTextRequest.nickname();

        if (nickname != null) {
            headerAccessor.getSessionAttributes().put("username", nickname);
        } else {
            System.err.println("nickname이 null 입니다.");
        }

        // 반환용 ChatTextRequest 구성
        return new ChatTextRequest(
                chatTextRequest.roomId(),
                chatTextRequest.userId(),
                nickname,
                chatTextRequest.content() != null ? chatTextRequest.content() : "",
                chatTextRequest.type(),
                chatTextRequest.createdAt() != null ? chatTextRequest.createdAt() : LocalDateTime.now()
        );
    }


}