/**
 * 사용자 서비스 인터페이스
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.domain.user.service;

import com.loople.backend.v1.domain.user.dto.SignupRequestDto;

/**
 * 사용자 관련 비즈니스 로직 명세
 */
public interface UserService {

    /**
     * 프로필 이미지 수정
     * @param imageUrl - 저장할 이미지 URL
     */
    void updateProfileImage(String imageUrl);

    void saveUserInfo(SignupRequestDto request);
}
