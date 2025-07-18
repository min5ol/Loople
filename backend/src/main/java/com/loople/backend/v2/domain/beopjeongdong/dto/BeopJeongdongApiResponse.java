/**
 * 작성일자: 2025-07-14
 * 작성자: 장민솔
 * 설명: 공공데이터포털 법정동 API의 전체 응답 포맷을 매핑하는 DTO
 *       - currentCount: 현재 페이지의 데이터 수
 *       - data: 법정동 데이터 리스트 (BeopjeongdongDto 목록)
 */

package com.loople.backend.v2.domain.beopjeongdong.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record BeopJeongdongApiResponse(
        @JsonProperty("currentCount") int currentCount, // 현재 응답에 포함된 데이터 개수
        @JsonProperty("data") List<BeopjeongdongDto> data // 실제 법정동 데이터 리스트
) {}