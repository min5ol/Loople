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
    ADDRESS_NOT_FOUND("해당 주소에 해당하는 동코드를 찾을 수 없습니다."),
    SIGNUP_NOT_COMPLETE("유저의 가입 필수 정보가 모두 입력되지 않았습니다."),
    ALREADY_ASSIGNED_AVATAR("이미 아바타가 설정되어 있습니다."),
    ALREADY_ASSIGNED_BADGE("이미 뱃지가 설정되어 있습니다."),
    ALREADY_ASSIGNED_ROOM("이미 방이 설정되어 있습니다."),
    ALREADY_ASSIGNED_LOOPLING("이미 루플링이 설정되어 있습니다."),
    ALREADY_ASSIGNED_VILLAGE("이미 마을이 설정되어 있습니다."),
    BADGE_NOT_FOUND("기본 뱃지를 찾을 수 없습니다."),
    LOOPLING_NOT_FOUND("루플링 카탈로그를 찾을 수 없습니다.");

    private final String message;
}
