package com.loople.backend.v2.domain.chat.controller;

import com.loople.backend.v2.domain.chat.dto.*;
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

import java.util.ArrayList;
import java.util.List;

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

        String prompt = chatTextRequest.getContent()
                + " 쓰레기 처리 방법에 대해 알려줘 !\n"
                + "두괄식으로 어떻게 할지 먼저 써주고 그 뒤에 설명 붙여줘\n"
                + "줄글의 형식으로 보여주며 줄바꿈 적용해서 가독성 있게 답장 부탁해";

        return openApiClient.requestChatCompletion(prompt)
                .flatMap(AIResponse -> {
                    //보낸 메시지 저장
                    chatService.saveText(chatTextRequest, userId);

                    //응답 메시지 저장
                    chatService.saveResponse(chatTextRequest.getRoomId(), AIResponse);
                    return Mono.just(AIResponse);
                });
    }

    @GetMapping("/buildRoom/withAI")
    public ChatRoomResponse getRoomNum(HttpServletRequest request){
        System.out.println("채팅방 생성");
        Long userId = getLoggedInUserId.getUserId(request);
        return chatService.buildRoomWithAI(userId);
    }

    @GetMapping("/category")
    public List<ChatbotCategoryResponse> getMainCategory(@RequestParam String categoryType, @RequestParam(required=false) Long parentId){
        System.out.println("categoryType = " + categoryType);
        return chatService.getCategory(categoryType, parentId);
    }

    @GetMapping("/details")
    public List<ChatbotCategoryDetailResponse> getDetails(@RequestParam Long parentId, HttpServletRequest request){
        System.out.println("parentId = " + parentId);
        Long userId = getLoggedInUserId.getUserId(request);

        return chatService.getDetail(parentId, userId);
    }

}