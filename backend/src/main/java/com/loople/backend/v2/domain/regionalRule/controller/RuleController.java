package com.loople.backend.v2.domain.regionalRule.controller;

import com.loople.backend.v2.domain.chat.dto.LocalGovenmentWasteInfoResponse;
import com.loople.backend.v2.domain.regionalRule.dto.RegionRequest;
import com.loople.backend.v2.domain.regionalRule.service.RuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/regionalRules")
@RequiredArgsConstructor
public class RuleController {
    private final RuleService ruleService;

    @PostMapping("/region")
    public List<String> getRegion(@RequestBody RegionRequest regionRequest){
        return ruleService.getRegion(regionRequest);
    }

    @PostMapping("/getRule")
    public List<LocalGovenmentWasteInfoResponse> getRule(@RequestBody RegionRequest regionRequest){
        return ruleService.getRule(regionRequest);
    }
}
