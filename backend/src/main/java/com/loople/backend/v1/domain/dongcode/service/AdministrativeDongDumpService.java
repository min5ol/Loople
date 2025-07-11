/**
 * 행정동 데이터 덤프 서비스
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.domain.dongcode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loople.backend.v1.domain.dongcode.dto.DongItem;
import com.loople.backend.v1.domain.dongcode.dto.DongResponse;
import com.loople.backend.v1.domain.dongcode.entity.AdministrativeDong;
import com.loople.backend.v1.domain.dongcode.repository.AdministrativeDongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 공공 API 호출하여 행정동 데이터 수집 및 저장
 */
@Service
@RequiredArgsConstructor
public class AdministrativeDongDumpService {

    private final RestTemplate restTemplate; // API 요청용
    private final ObjectMapper objectMapper; // JSON 파싱
    private final AdministrativeDongRepository repository; // DB 저장

    private static final String SERVICE_KEY = "5XKFEYF43oYs3Om6Khnyz05BGRaXOcSHrfLS%2Fwhaa%2BMsj%2FWXw1VxuZJXmAkh6dMpTrmXQyc5Lwxjr5C99WBxew%3D%3D";
    private static final String BASE_URL = "https://api.odcloud.kr/api/15063424/v1/uddi:6d7fd177-cc7d-426d-ba80-9b137edf6066";

    /**
     * 행정동 데이터 덤프 실행
     * @throws Exception - 호출 실패 시
     */
    public void dump() throws Exception {
        int page = 1;
        int perPage = 1000;

        while (true) {
            String rawUrl = BASE_URL
                    + "?serviceKey=" + SERVICE_KEY
                    + "&page=" + page
                    + "&perPage=" + perPage
                    + "&returnType=JSON";

            URI uri = new URI(rawUrl); // 호출 URL 생성

            System.out.println("호출 URL: " + uri);

            HttpHeaders headers = new HttpHeaders();
            headers.set("accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            String json = responseEntity.getBody();
            DongResponse response = objectMapper.readValue(json, DongResponse.class); // JSON 파싱
            List<DongItem> items = response.getData();

            if (items == null || items.isEmpty()) {
                System.out.println("No more items. Finished at page " + page);
                break; // 더 이상 데이터 없음
            }

            List<AdministrativeDong> entities = items.stream()
                    .map(i -> AdministrativeDong.builder()
                            .sido(i.getSido())
                            .sigungu(i.getSigungu())
                            .eupmyun(i.getEupmyun())
                            .dongCode(i.getDongCode())
                            .createdAt(LocalDateTime.now())
                            .build())
                    .toList(); // 엔티티 변환

            repository.saveAll(entities); // DB 저장
            System.out.println("Page " + page + " inserted: " + entities.size() + " rows");

            page++; // 다음 페이지
        }
    }

    public AdministrativeDong getBeopjeongCodeByAddress(String sido, String sigungu, String eupmyun) {
        List<AdministrativeDong> dongList = repository.findBySidoAndSigunguAndEupmyun(sido, sigungu, eupmyun);
        if (dongList == null || dongList.isEmpty()) {
            throw new IllegalArgumentException("해당 주소를 찾을 수 없습니다.");
        }
        return dongList.get(0); // 첫 번째 결과만 반환
    }

}
