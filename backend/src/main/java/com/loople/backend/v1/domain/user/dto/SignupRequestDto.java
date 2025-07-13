package com.loople.backend.v1.domain.user.dto;

import com.loople.backend.v1.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SignupRequestDto {
    private String email;
    private String profileImageUrl;
    private String password;
    private String name;
    private String nickname;
    private String phone;
    private String sido;
    private String sigungu;
    private String eupmyun;
    private String ri;
    private String detailAddress;
    private Double gpsLat;
    private Double gpsLng;

    public User toEntity(){
        return User.builder()
                .email(email)
                .profileImageUrl(profileImageUrl)
                .password(password)
                .name(name)
                .nickname(nickname)
                .phone(phone)
                .residenceId(null)
                .detailAddress(detailAddress)
                .provider("local")
                .role("USER")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isDeleted(false)
                .build();
    }
}
