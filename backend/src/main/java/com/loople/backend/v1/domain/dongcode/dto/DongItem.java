/**
 * 행정동 단일 아이템 DTO
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.domain.dongcode.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 공공 API 단일 행정동 데이터 매핑
 */
@Data
public class DongItem {

    @JsonProperty("시도명")
    private String sido; // 시도

    @JsonProperty("시군구명")
    private String sigungu; // 시군구

    @JsonProperty("읍면동명")
    private String eupmyun; // 읍면동

    @JsonProperty("법정동코드")
    private String dongCode; // 법정동 코드
}
