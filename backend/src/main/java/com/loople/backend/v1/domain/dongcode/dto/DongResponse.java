/**
 * 행정동 API 응답 DTO
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.domain.dongcode.dto;

import lombok.Data;

import java.util.List;

/**
 * 공공 API 응답 데이터 매핑
 */
@Data
public class DongResponse {

    private List<DongItem> data; // 행정동 데이터 목록
}