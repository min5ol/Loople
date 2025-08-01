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

    @GetMapping("/sido")
    public List<String> getSido(){
        System.out.println("== getSido ==");
        return ruleService.getSido();
    }

    @GetMapping("/sigungu")
    public List<String> getSigungu(@RequestParam String sido){
        System.out.println("== getSigungu ==");
        return ruleService.getSigungu(sido);
    }

    @GetMapping("/eupmyun")
    public List<String> getEupmyun(@RequestParam String sigungu){
        System.out.println("== getEupmyun ==");
        return ruleService.getEupmyun(sigungu);
    }

    @GetMapping("/ri")
    public List<String> getRi(@RequestParam String eupmyun){
        System.out.println("== getRi ==");
        return ruleService.getRi(eupmyun);
    }

    @PostMapping("/getRule")
    public List<LocalGovenmentWasteInfoResponse> getRule(@RequestBody RegionRequest regionRequest){
        return ruleService.getRule(regionRequest);
    }
}
