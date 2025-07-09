/**
 * 프로필 이미지 요청 DTO
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.domain.user.dto;

import lombok.Data;

/**
 * 프로필 이미지 변경 요청 정보 전달
 */
@Data
public class ProfileImageRequestDto {

    private String imageUrl; // 프로필 이미지 URL
}
