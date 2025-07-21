package com.loople.backend.v2.global.jwt;

import com.loople.backend.v2.domain.users.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService
{
    private final JwtProvider jwtProvider;

    @Override
    public String issueToken(User user)
    {
        return jwtProvider.createToken(user.getNo(), user.getRole());
    }

    @Override
    public boolean validate(String token) {
        return jwtProvider.validateToken(token);
    }

    @Override
    public Long extractUserId(String token)
    {
        return jwtProvider.getUserId(token);
    }

    @Override
    public String extractRole(String token) {
        return jwtProvider.getRole(token);
    }
}
