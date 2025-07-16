package com.loople.backend.v2.global.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor(force = true)
public class OpenApiResponse {
    /**
     * OpenAI API 응답 DTO 클래스
     */
    private final Choice[] choices;
}
