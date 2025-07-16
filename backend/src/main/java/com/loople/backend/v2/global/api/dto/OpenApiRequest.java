package com.loople.backend.v2.global.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor(force=true)
@Getter
public class OpenApiRequest {

    /**
     * OpenAI API 요청에 맞는 요청 DTO 클래스
     */
    public final String model;
    public final Message[] messages;
    public final double temperature;
}
