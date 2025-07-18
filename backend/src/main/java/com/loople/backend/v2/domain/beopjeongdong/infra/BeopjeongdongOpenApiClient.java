/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 공공데이터 포털의 법정동 전체 목록 API를 호출하고, 응답을 DTO로 파싱하는 클라이언트
 *       외부 API 호출에 RestTemplate과 ObjectMapper 사용
 */

package com.loople.backend.v2.domain.beopjeongdong.infra;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loople.backend.v2.domain.beopjeongdong.dto.BeopJeongdongApiResponse;
import com.loople.backend.v2.domain.beopjeongdong.dto.BeopjeongdongDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

@Slf4j // 로그 기록용 어노테이션
@Component // Spring Bean 등록
@RequiredArgsConstructor // 생성자 주입 자동 생성
public class BeopjeongdongOpenApiClient {

    private final RestTemplate restTemplate; // 외부 API 호출용
    private final ObjectMapper objectMapper; // JSON → DTO 매핑용

    // 공공데이터포털 API의 기본 URL 및 인증키
    private static final String BASE_URL = "https://api.odcloud.kr/api/15063424/v1/uddi:6d7fd177-cc7d-426d-ba80-9b137edf6066";
    private static final String RAW_SERVICE_KEY = "5XKFEYF43oYs3Om6Khnyz05BGRaXOcSHrfLS/whaa+Msj/WXw1VxuZJXmAkh6dMpTrmXQyc5Lwxjr5C99WBxew==";

    /**
     * 지정된 페이지(page)와 항목 수(perPage)로 법정동 데이터를 조회
     * 응답 JSON을 파싱하여 BeopjeongdongDto 리스트로 반환
     */
    public List<BeopjeongdongDto> fetchDongData(int page, int perPage) {
        try {
            // 인증키 인코딩 (1회만)
            String encodedKey = URLEncoder.encode(RAW_SERVICE_KEY, StandardCharsets.UTF_8);

            // 최종 요청 URL 조합
            String url = BASE_URL +
                    "?serviceKey=" + encodedKey +
                    "&page=" + page +
                    "&perPage=" + perPage +
                    "&returnType=JSON";

            URI uri = new URI(url);

            // 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.set("accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers); // 헤더 포함 요청 엔티티 구성

            // API 호출 (GET 요청)
            ResponseEntity<String> responseEntity = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
            String json = responseEntity.getBody(); // 응답 JSON 문자열

            // JSON → DTO 파싱
            BeopJeongdongApiResponse response = objectMapper.readValue(json, BeopJeongdongApiResponse.class);

            // 결과가 없을 경우 빈 리스트 반환
            if (response == null || response.data() == null || response.data().isEmpty()) {
                log.info("법정동 API page={} 결과 없음", page);
                return Collections.emptyList();
            }

            // 정상 데이터 로그 출력 및 반환
            log.info("법정동 API page={} 건수 : {}", page, response.data().size());
            return response.data();

        } catch (Exception e) {
            // 예외 발생 시 로그 출력 후 빈 리스트 반환
            log.error("법정동 API 호출 실패: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}