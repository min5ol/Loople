/**
 * 행정동 API 응답 바디 내부 DTO
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.domain.dongcode.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 공공 API 응답 바디의 items 영역 매핑
 */
@Data
public class DongResponseBodyItems {

    @JsonProperty("items")
    private DongItemWrapper items; // items 래퍼
}
