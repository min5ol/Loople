/**
 * 행정동 API 응답 items 래퍼 DTO
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.domain.dongcode.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * items 배열 감싸는 래퍼 클래스
 */
@Data
public class DongItemWrapper {

    @JsonProperty("item")
    private List<DongItem> itemList; // 행정동 아이템 목록
}
