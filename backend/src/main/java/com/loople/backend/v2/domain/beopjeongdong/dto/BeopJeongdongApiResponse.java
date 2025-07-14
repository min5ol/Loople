package com.loople.backend.v2.domain.beopjeongdong.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record BeopJeongdongApiResponse(
        @JsonProperty("currentCount") int currentCount,
        @JsonProperty("data")List<BeopjeongdongDto> data
) { }
