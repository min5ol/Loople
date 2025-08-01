package com.loople.backend.v2.domain.regionalRule.service;

import com.loople.backend.v2.domain.chat.dto.LocalGovenmentWasteInfoResponse;
import com.loople.backend.v2.domain.regionalRule.dto.RegionRequest;

import java.util.List;

public interface RuleService {
    List<String> getSido();
    List<String> getSigungu(String sido);
    List<String> getEupmyun(String sigungu);
    List<String> getRi(String eupmyun);
    List<LocalGovenmentWasteInfoResponse> getRule(RegionRequest regionRequest);
}
