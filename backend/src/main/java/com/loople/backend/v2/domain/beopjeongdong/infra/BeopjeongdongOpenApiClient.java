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

@Slf4j
@Component
@RequiredArgsConstructor
public class BeopjeongdongOpenApiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String BASE_URL = "https://api.odcloud.kr/api/15063424/v1/uddi:6d7fd177-cc7d-426d-ba80-9b137edf6066";
    private static final String RAW_SERVICE_KEY = "5XKFEYF43oYs3Om6Khnyz05BGRaXOcSHrfLS/whaa+Msj/WXw1VxuZJXmAkh6dMpTrmXQyc5Lwxjr5C99WBxew==";

    public List<BeopjeongdongDto> fetchDongData(int page, int perPage) {
        try {
            // 인코딩 1번만
            String encodedKey = URLEncoder.encode(RAW_SERVICE_KEY, StandardCharsets.UTF_8);

            String url = BASE_URL +
                    "?serviceKey=" + encodedKey +
                    "&page=" + page +
                    "&perPage=" + perPage +
                    "&returnType=JSON";

            URI uri = new URI(url);
            HttpHeaders headers = new HttpHeaders();
            headers.set("accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> responseEntity = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

            String json = responseEntity.getBody();
            BeopJeongdongApiResponse response = objectMapper.readValue(json, BeopJeongdongApiResponse.class);

            if (response == null || response.data() == null || response.data().isEmpty()) {
                log.info("법정동 API page={} 결과 없음", page);
                return Collections.emptyList();
            }

            log.info("법정동 API page={} 건수 : {}", page, response.data().size());
            return response.data();
        } catch (Exception e) {
            log.error("법정동 API 호출 실패: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
