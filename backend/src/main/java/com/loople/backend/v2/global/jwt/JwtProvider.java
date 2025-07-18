package com.loople.backend.v2.global.jwt;

import com.loople.backend.v2.domain.users.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider
{
    @Value("${jwt.secret}")
    private String secretKeyPlain;

    @Value("${jwt.expiration}")
    private long tokenValidityInMillis;

    private Key key;

    @PostConstruct
    public void init()
    {
        this.key = Keys.hmacShaKeyFor(secretKeyPlain.getBytes());
    }

    public String createToken(Long userNo, Role role)
    {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + tokenValidityInMillis);

        return Jwts.builder()
                .setSubject(String.valueOf(userNo))
                .claim("role",role)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private Claims parseClaims(String token)
    {
        return Jwts.parserBuilder()
                .setSigningKey(this.key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Long getUserId(String token)
    {
        return Long.valueOf(parseClaims(token).getSubject());
    }

    public String getRole(String token)
    {
        return parseClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token)
    {
        try
        {
            parseClaims(token);
            return true;
        }
        catch (JwtException | IllegalArgumentException e)
        {
            return false;
        }
    }
}
