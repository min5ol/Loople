package com.loople.backend.v2.domain.regionalRule.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegionRequest {
    private String sido;
    private String sigungu;
    private String eupmyun;
    private String ri;
}
