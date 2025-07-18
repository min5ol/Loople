/**
 * 작성일자: 2025-07-14
 * 작성자: 장민솔
 * 설명: 법정동 오픈API 응답에서 단일 동 항목을 매핑하는 DTO
 *       시도, 시군구, 읍면동, 리, 법정동코드를 포함
 */

package com.loople.backend.v2.domain.beopjeongdong.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BeopjeongdongDto(
        @JsonProperty("시도명") String sido,           // 시/도 명칭 (예: 경상남도)
        @JsonProperty("시군구명") String sigungu,     // 시/군/구 명칭 (예: 창원시 마산회원구)
        @JsonProperty("읍면동명") String eupmeyon,    // 읍/면/동 명칭 (예: 내서읍)
        @JsonProperty("리명") String ri,              // 리 명칭 (예: 삼계리)
        @JsonProperty("법정동코드") String dongCode   // 법정동 코드 (예: 4812735021)
) {}