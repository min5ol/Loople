/**
 * 작성일자: 2025-07-14
 * 작성자: 장민솔
 * 설명: 공공데이터포털 법정동 API의 전체 응답 포맷을 매핑하는 DTO
 */

package com.loople.backend.v2.domain.beopjeongdong.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record BeopJeongdongApiResponse(
        @JsonProperty("currentCount") int currentCount,
        @JsonProperty("data")List<BeopjeongdongDto> data
) { }
