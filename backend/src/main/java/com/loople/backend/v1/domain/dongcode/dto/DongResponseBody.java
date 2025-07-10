/**
 * 행정동 API 응답 바디 DTO
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.domain.dongcode.dto;

import lombok.Data;

/**
 * 공공 API 응답 바디 매핑
 */
@Data
public class DongResponseBody {

    private DongResponseBodyItems body; // 실제 데이터 바디
}