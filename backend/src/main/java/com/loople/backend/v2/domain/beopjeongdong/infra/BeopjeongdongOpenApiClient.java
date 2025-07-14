package com.loople.backend.v2.domain.beopjeongdong.infra;

import com.loople.backend.v2.domain.beopjeongdong.dto.BeopJeongdongApiResponse;
import com.loople.backend.v2.domain.beopjeongdong.dto.BeopjeongdongDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BeopjeongdongOpenApiClient
{
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String BASE_URL = "https://api.odcloud.kr/api/15063424/v1/uddi:257e1510-0eeb-44de-8883-8295c94dadf7";
    private static final String API_KEY = "5XKFEYF43oYs3Om6Khnyz05BGRaXOcSHrfLS%2Fwhaa%2BMsj%2FWXw1VxuZJXmAkh6dMpTrmXQyc5Lwxjr5C99WBxew%3D%3D";

    public List<BeopjeongdongDto> fetchDongData(int page, int perPage)
    {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("page",page)
                .queryParam("perPage",perPage)
                .queryParam("returnType","JSON")
                .queryParam("serviceKey",API_KEY)
                .toUriString();

        try
        {
            BeopJeongdongApiResponse response = restTemplate.getForObject(url, BeopJeongdongApiResponse.class);

            if(response == null || response.data() == null || response.data().isEmpty())
            {
                log.info("법정동 API page={} 결과 없음", page);
                return Collections.emptyList();
            }

            log.info("법정동 API page={} 건수 : {}", page, response.data().size());
            return response.data();
        }
        catch (Exception e)
        {
            log.error("법정동 API 호출 실패: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
