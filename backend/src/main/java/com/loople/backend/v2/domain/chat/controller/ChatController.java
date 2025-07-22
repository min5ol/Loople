package com.loople.backend.v2.domain.chat.controller;

import com.loople.backend.v2.domain.chat.dto.ChatRoomRequest;
import com.loople.backend.v2.domain.chat.dto.ChatRoomResponse;
import com.loople.backend.v2.domain.chat.dto.ChatTextRequest;
import com.loople.backend.v2.domain.chat.entity.ChatRoom;
import com.loople.backend.v2.domain.chat.service.ChatService;
import com.loople.backend.v2.global.api.OpenApiClient;
import com.loople.backend.v2.global.exception.UnauthorizedException;
import com.loople.backend.v2.global.getUserId.GetLoggedInUserId;
import com.loople.backend.v2.global.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v2/chat/completion")
@RequiredArgsConstructor
public class ChatController {

    private final OpenApiClient openApiClient;
    private final ChatService chatService;
    private final GetLoggedInUserId getLoggedInUserId;

    // POST 방식으로 메시지 받아 OpenAI 응답 반환
    @PostMapping(value = "/withAI/text")
    public Mono<String> chatWithAI(@RequestBody ChatTextRequest chatTextRequest, HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);

        System.out.println("chatTextRequest = " + chatTextRequest.toString());

        return openApiClient.requestChatCompletion(chatTextRequest.getContent())
                .flatMap(AIResponse -> {
                    //보낸 메시지 저장
                    chatService.saveText(chatTextRequest, userId);

                    //응답 메시지 저장
                    chatService.saveResponse(chatTextRequest.getRoomId(), AIResponse);
                    return Mono.just(AIResponse);
                });
    }

    @GetMapping("/withAI/room")
    public ChatRoomResponse getRoomNum(HttpServletRequest request){
        System.out.println("채팅방 생성");
        Long userId = getLoggedInUserId.getUserId(request);
        return chatService.buildRoomWithAI(userId);
    }

}