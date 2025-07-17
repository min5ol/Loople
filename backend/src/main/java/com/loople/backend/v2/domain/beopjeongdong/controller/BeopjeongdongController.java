package com.loople.backend.v2.domain.beopjeongdong.controller;

import com.loople.backend.v2.domain.beopjeongdong.service.BeopjeongdongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/beopjeongdong")
public class BeopjeongdongController {

    private final BeopjeongdongService beopjeongdongService;

    @GetMapping("/dong-code")
    public ResponseEntity<Map<String, String>> getDongCode(
            @RequestParam String sido,
            @RequestParam String sigungu,
            @RequestParam String eupmyun,
            @RequestParam(required = false) String ri
    ) {
        String dongCode = beopjeongdongService.getDongCode(sido, sigungu, eupmyun, ri);
        return ResponseEntity.ok(Map.of("dongCode", dongCode));
    }
}
