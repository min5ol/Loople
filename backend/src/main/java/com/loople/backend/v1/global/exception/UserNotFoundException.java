/**
 * 사용자 없음 예외
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.global.exception;

/**
 * 사용자를 찾을 수 없을 때 발생
 */
public class UserNotFoundException extends RuntimeException {

    /**
     * 사용자 없음 예외 생성자
     * @param message - 예외 메시지
     */
    public UserNotFoundException(String message) {
        super(message); // 부모 생성자 호출
    }
}
