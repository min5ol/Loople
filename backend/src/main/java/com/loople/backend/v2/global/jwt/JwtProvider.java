/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: JWT 생성 및 검증, Claim 추출 등의 기능을 제공하는 Provider 클래스
 */

package com.loople.backend.v2.global.jwt;

import com.loople.backend.v2.domain.users.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKeyPlain; // application.properties에 정의된 시크릿 키 (plain text)

    @Value("${jwt.expiration}")
    private long tokenValidityInMillis; // 토큰 유효 시간 (밀리초)

    private Key key; // 서명용 Secret Key 객체

    // 빈 생성 이후 실행: 시크릿 키를 HMAC 키 객체로 변환
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKeyPlain.getBytes());
    }

    // 사용자 정보로 JWT 생성
    public String createToken(Long userNo, Role role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + tokenValidityInMillis);

        return Jwts.builder()
                .setSubject(String.valueOf(userNo))        // 사용자 ID
                .claim("role", role)                       // 권한 Claim 추가
                .setIssuedAt(now)                          // 발급 시간
                .setExpiration(expiry)                     // 만료 시간
                .signWith(key, SignatureAlgorithm.HS256)   // 서명 방식 및 키
                .compact();                                // 최종 문자열로 변환
    }

    // 토큰을 파싱하여 Claims 반환
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(this.key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 토큰에서 사용자 ID 추출
    public Long getUserId(String token) {
        return Long.valueOf(parseClaims(token).getSubject());
    }

    // 토큰에서 Role 추출 (현재 인증에는 사용되지 않지만 추후 권한 검증용으로 활용 가능)
    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            parseClaims(token); // 예외 없으면 유효
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false; // 잘못된 형식, 서명 오류, 만료 등
        }
    }
}