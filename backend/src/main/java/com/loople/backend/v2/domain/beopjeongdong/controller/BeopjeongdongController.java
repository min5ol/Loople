/*
 * 작성일: 2025.07.14
 * 작성자: 장민솔
 * 설명: 주소 정보(시도, 시군구, 읍면동, 리)를 기반으로 동코드(dongCode)를 조회하는 API 컨트롤러
 */

package com.loople.backend.v2.domain.beopjeongdong.controller;

import com.loople.backend.v2.domain.beopjeongdong.service.BeopjeongdongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController // 해당 클래스가 REST API 컨트롤러임을 명시
@RequiredArgsConstructor // final 필드에 대해 생성자 주입을 자동으로 생성
@RequestMapping("/api/v2/beopjeongdong") // 이 컨트롤러의 기본 경로 설정
public class BeopjeongdongController {

    private final BeopjeongdongService beopjeongdongService; // 동코드 조회 서비스 의존성 주입

    /*
     * GET /dong-code
     * 주소 정보를 기반으로 행정동코드(dongCode)를 조회
     *
     * 예시 요청:
     * /api/v2/beopjeongdong/dong-code?sido=경상남도&sigungu=창원시마산회원구&eupmyun=내서읍&ri=삼계리
     */
    @GetMapping("/dong-code")
    public ResponseEntity<Map<String, String>> getDongCode(
            @RequestParam String sido,        // 시/도
            @RequestParam String sigungu,     // 시/군/구
            @RequestParam String eupmyun,     // 읍/면/동
            @RequestParam(required = false) String ri // (선택) 리
    ) {
        /* 입력 값의 앞뒤 공백 제거 (입력 실수 방지) */
        String trimmedSido = sido.trim();
        String trimmedSigungu = sigungu.trim();
        String trimmedEupmyun = eupmyun.trim();
        String trimmedRi = (ri != null && !ri.isBlank()) ? ri.trim() : null;

        // 주소 정보를 기반으로 dongCode 조회
        String dongCode = beopjeongdongService.getDongCode(trimmedSido, trimmedSigungu, trimmedEupmyun, trimmedRi);

        // 결과를 JSON 형태로 반환 (ex: { "dongCode": "4812735021" })
        return ResponseEntity.ok(Map.of("dongCode", dongCode));
    }
}