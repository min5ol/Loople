package com.loople.backend.v2.domain.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record SocialSignupRequest(

        @Email(message = "올바른 이메일 형식이 아닙니다.")
        @NotBlank(message = "이메일은 필수입니다.")
        String email,

        @NotBlank(message = "소셜 ID는 필수입니다.")
        String socialId,

        @NotBlank(message = "provider는 필수입니다. (예: GOOGLE, KAKAO, NAVER, APPLE)")
        String provider,

        @NotBlank(message = "이름은 필수입니다.")
        String name,

        @NotBlank(message = "닉네임은 필수입니다.")
        String nickname,

        @NotBlank(message = "휴대폰 번호는 필수입니다.")
        @Pattern(regexp = "^01[016789]-\\d{3,4}-\\d{4}$",
        message = "휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)")
        String phone,

        String detailAddress,

        String profileImageUrl,

        @NotBlank(message = "시도 정보는 필수입니다.")
        String sido,

        @NotBlank(message = "시군구 정보는 필수입니다.")
        String sigungu,

        @NotBlank(message = "읍면동 정보는 필수입니다.")
        String eupmyun,

        String ri,

        String looplingType
)
{
        public String fullAddress()
        {
                if(ri != null && !ri.isBlank())
                {
                        return String.join(" ", sido, sigungu, eupmyun, ri);
                }
                return String.join(" ", sido, sigungu, eupmyun);
        }
}