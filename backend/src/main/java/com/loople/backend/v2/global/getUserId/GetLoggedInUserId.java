package com.loople.backend.v2.global.getUserId;

import com.loople.backend.v2.global.exception.UnauthorizedException;
import com.loople.backend.v2.global.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class GetLoggedInUserId {

    private final JwtProvider jwtProvider;

    //현재 로그인 된 사용자 ID를 JWT 토큰에서 추출
    public Long getUserId(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization"); //Authorization 헤더 추출
        if (!StringUtils.hasText(bearer) || !bearer.startsWith("Bearer ")) {    //헤더 유효성 검사
            throw new UnauthorizedException("Authorization 헤더가 존재하지 않거나 유효하지 않습니다.");
        }
        String token = bearer.substring(7); //JWT 토큰 추출
        if (!jwtProvider.validateToken(token)) {    //JWT 유효성 검사
            throw new UnauthorizedException("JWT Token이 존재하지 않습니다.");
        }
        return jwtProvider.getUserId(token);    //사용자 ID 추출
    }
}
