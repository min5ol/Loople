/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: 인증 실패 시 발생하는 예외 (HTTP 401 반환)
 */

package com.loople.backend.v2.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends RuntimeException
{
    public UnauthorizedException(String message)
    {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
