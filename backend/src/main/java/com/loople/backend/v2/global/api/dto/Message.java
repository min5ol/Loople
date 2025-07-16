package com.loople.backend.v2.global.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
public class Message {

    /**
     * 메시지 역할(role)과 내용(content)을 담는 DTO 클래스
     */
    public final String role;
    public final String content;
}
