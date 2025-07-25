package com.loople.backend.v2.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode
{
    EMAIL_ALREADY_EXISTS("이미 존재하는 이메일입니다."),
    NICKNAME_ALREADY_EXISTS("이미 존재하는 닉네임입니다."),
    USER_NOT_FOUND("사용자를 찾을 수 없습니다."),
    INVALID_PASSWORD("비밀번호가 일치하지 않습니다."),
    ADDRESS_NOT_FOUND("해당 주소에 해당하는 동코드를 찾을 수 없습니다.");

    private final String message;
}
