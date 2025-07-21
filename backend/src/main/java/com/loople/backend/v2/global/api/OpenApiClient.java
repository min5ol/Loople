/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: OpenAPI와 통신하는 클라이언트 컴포넌트
        WebClient를 이용해 OpenAPI Chat Completion API에 요청을 보내고 응답을 받아 처리
*/
package com.loople.backend.v2.global.api;

import com.loople.backend.v2.global.api.dto.Choice;
import com.loople.backend.v2.global.api.dto.OpenApiRequest;
import com.loople.backend.v2.global.api.dto.OpenApiResponse;
import com.loople.backend.v2.global.api.dto.Message;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@Slf4j
public class OpenApiClient {
    private WebClient webClient;    //WebClient 인스턴스

    @Value("${openai.api.key}")
    private String secretKey;   //OpenAI API 키

    @Value("${openai.api.base-url}")
    private String apiUrl;  //OpenAI API 기본 URL

    @Value("${openai.api.model}")
    private String model;   //사용할 모델 이름
    
    private final WebClient.Builder webClientBuilder;   //WebClient 빌더 주입

    public OpenApiClient(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @PostConstruct
    public void init(){
        //빈(Bean) 초기화 후 Webclient 인스턴스 생성, 기본 URL 설정
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }

    //사용자의 메시지를 받아 OpenAI Chat Completion API 호출, 응답 메시지 문자열 반환
    public Mono<String> requestChatCompletion(String userMessage){
        log.debug("요청 메시지: {}", userMessage);
        //요청 바디 생성
        OpenApiRequest requestBody = new OpenApiRequest(
                model,
                new Message[]{ new Message("user", userMessage) },
                0.8f    //temperature 설정(출력 다양성 조절)
        );

        return webClient.post() //POST 요청
                .header("Authorization", "Bearer " + secretKey) //인증 헤더 추가
                .bodyValue(requestBody) //요청 본문 설정
                .retrieve() //응답 조회
                //에러 응답 시 custom 처리
                .onStatus(status -> status.isError(), response -> {
                    return response.bodyToMono(String.class)
                            .map(errorBody -> new OpenApiException("API 호출 실패: "+errorBody))
                            .flatMap(e -> Mono.defer(() -> Mono.error(e)));
                })
                .bodyToMono(OpenApiResponse.class)  //응답을 OpenApiResponse 객체로 변환
                .map(response -> {
                    List<Choice> choices = response.getChoices();
                    log.debug("응답 메시지: {}", choices);
                    if (choices != null && !choices.isEmpty()) {
                        return choices.get(0).getMessage().getContent();       //첫 번째 선택지의 메시지 내용만 추출하여 Mono<String>으로 반환
                    } else {
                        return "";
                    }
                });
    }

    private static class OpenApiException extends RuntimeException {
        public OpenApiException(String message) {
            super(message);
        }
    }


}
