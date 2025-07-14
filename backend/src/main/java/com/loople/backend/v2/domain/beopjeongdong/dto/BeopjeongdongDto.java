package com.loople.backend.v2.domain.beopjeongdong.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BeopjeongdongDto(
        @JsonProperty("시도명") String sido,
        @JsonProperty("시군구명") String sigungu,
        @JsonProperty("읍면동명") String eupmeyon,
        @JsonProperty("리명") String ri,
        @JsonProperty("법정동코드") String dongCode
) {}