package com.loople.backend.v1.domain.dongcode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loople.backend.v1.domain.dongcode.dto.DongItem;
import com.loople.backend.v1.domain.dongcode.dto.DongResponse;
import com.loople.backend.v1.domain.dongcode.entity.AdministrativeDong;
import com.loople.backend.v1.domain.dongcode.repository.AdministrativeDongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdministrativeDongDumpService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AdministrativeDongRepository repository;

    private static final String SERVICE_KEY = "5XKFEYF43oYs3Om6Khnyz05BGRaXOcSHrfLS%2Fwhaa%2BMsj%2FWXw1VxuZJXmAkh6dMpTrmXQyc5Lwxjr5C99WBxew%3D%3D";
    private static final String BASE_URL = "https://api.odcloud.kr/api/15063424/v1/uddi:6d7fd177-cc7d-426d-ba80-9b137edf6066";

    public void dump() throws Exception {
        int page = 1;
        int perPage = 1000;

        Set<String> uniqueKeys = new HashSet<>();

        while (true) {
            String rawUrl = BASE_URL +
                    "?serviceKey=" + SERVICE_KEY +
                    "&page=" + page +
                    "&perPage=" + perPage +
                    "&returnType=JSON";

            URI uri = new URI(rawUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.set("accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> responseEntity = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

            String json = responseEntity.getBody();
            DongResponse response = objectMapper.readValue(json, DongResponse.class);
            List<DongItem> items = response.getData();

            if (items == null || items.isEmpty()) {
                System.out.println("✔️ No more items. Stopped at page " + page);
                break;
            }

            List<AdministrativeDong> entities = items.stream()
                    .filter(i -> i.getSido() != null && i.getSigungu() != null && i.getEupmyun() != null)
                    .filter(i -> {
                        String key = i.getSido() + "|" + i.getSigungu() + "|" + i.getEupmyun();
                        return uniqueKeys.add(key); // 중복되면 false여서 자동 제거됨
                    })
                    .map(i -> AdministrativeDong.builder()
                            .sido(i.getSido())
                            .sigungu(i.getSigungu())
                            .eupmyun(i.getEupmyun())
                            .riName(i.getRiName())
                            .dongCode(i.getDongCode())
                            .order(i.getOrder())
                            .createdAt(LocalDateTime.now())
                            .build())
                    .toList();

            repository.saveAll(entities);
            System.out.println("✅ Page " + page + " inserted: " + entities.size() + " rows");

            page++;
        }
    }

    /**
     * 사용자가 입력한 주소로 행정동 코드 조회 (ri 값 유무 대응)
     */
    public AdministrativeDong getByAddress(String sido, String sigungu, String eupmyun, String riName) {
        Optional<AdministrativeDong> result = repository
                .findBySidoAndSigunguAndEupmyun(sido, sigungu, eupmyun)
                .stream()
                .findFirst();

        return result.orElseThrow(() -> new IllegalArgumentException(String.format(
                "주소를 찾을 수 없습니다. (sido: %s, sigungu: %s, eupmyun: %s, ri: %s)",
                sido, sigungu, eupmyun, riName
        )));
    }
}
