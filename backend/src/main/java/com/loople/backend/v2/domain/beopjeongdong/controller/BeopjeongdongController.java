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
        // 공백 제거 (혹시 모를 입력 오류 방지)
        String trimmedSido = sido.trim();
        String trimmedSigungu = sigungu.trim();
        String trimmedEupmyun = eupmyun.trim();
        String trimmedRi = (ri != null && !ri.isBlank()) ? ri.trim() : null;

        String dongCode = beopjeongdongService.getDongCode(trimmedSido, trimmedSigungu, trimmedEupmyun, trimmedRi);
        return ResponseEntity.ok(Map.of("dongCode", dongCode));
    }
}