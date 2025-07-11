package com.loople.backend.v1.domain.user.dto;

import com.loople.backend.v1.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SignupRequestDto {
    private String email; // 사용자 이메일
    private String profileImageUrl; // 프로필 이미지 URL
    private String password;
    private String name;
    private String nickname;
    private String phone;
    private String sido;
    private String sigungu;
    private String eupmyun;
    private String detailAddress;   //상세주소

    public User toEntity(){
        return User.builder()
                .email(email)
                .profileImageUrl(profileImageUrl)
                .password(password)
                .name(name)
                .nickname(nickname)
                .phone(phone)
                .residenceId(1234567890L)   //임시데이터 생성
                .detailAddress(detailAddress)
                .provider("local") // 기본값 설정
                .role("USER")      // 기본값 설정
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isDeleted(false)
                .build();
    }
}
