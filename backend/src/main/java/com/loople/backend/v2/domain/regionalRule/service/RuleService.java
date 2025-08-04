package com.loople.backend.v2.domain.regionalRule.service;

import com.loople.backend.v2.domain.chat.dto.LocalGovenmentWasteInfoResponse;
import com.loople.backend.v2.domain.regionalRule.dto.RegionRequest;

import java.util.List;

public interface RuleService {
    List<LocalGovenmentWasteInfoResponse> getRule(RegionRequest regionRequest);
    List<String> getRegion(RegionRequest regionRequest);
}
