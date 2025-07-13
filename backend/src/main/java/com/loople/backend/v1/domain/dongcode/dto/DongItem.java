package com.loople.backend.v1.domain.dongcode.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DongItem {

    @JsonProperty("시도명")
    private String sido;

    @JsonProperty("시군구명")
    private String sigungu;

    @JsonProperty("읍면동명")
    private String eupmyun;

    @JsonProperty("리명")
    private String riName;

    @JsonProperty("법정동코드")
    private String dongCode;

    @JsonProperty("순위")
    private int order;
}
