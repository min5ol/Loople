package com.loople.backend.v1.domain.user.dto;

import lombok.Data;

@Data
public class SignupResponseDto {
    private Long id; // PK
    private String email; // 사용자 이메일
    private String profileImageUrl; // 프로필 이미지 URL
    private String password;
    private String name;
    private String nickname;
    private String phone;
    private String detailAddress;   //상세주소
}
