package com.loople.backend.v2.global.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException
{
    private final ErrorCode errorCode;

    public CustomException(ErrorCode errorCode)
    {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
