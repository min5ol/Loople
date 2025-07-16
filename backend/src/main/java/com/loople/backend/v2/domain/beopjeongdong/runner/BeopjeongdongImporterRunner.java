/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 애플리케이션 시작 시 법정동 API에서 모든 동 정보를 가져와 DB에 저장하는 러너
 */

package com.loople.backend.v2.domain.beopjeongdong.runner;

import com.loople.backend.v2.domain.beopjeongdong.dto.BeopjeongdongDto;
import com.loople.backend.v2.domain.beopjeongdong.infra.BeopjeongdongOpenApiClient;
import com.loople.backend.v2.domain.beopjeongdong.service.BeopjeongdongService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

// @Component
@RequiredArgsConstructor
public class BeopjeongdongImporterRunner implements CommandLineRunner
{
    private final BeopjeongdongOpenApiClient openApiClient;
    private final BeopjeongdongService beopjeongdongService;

    @Override
    public void run(String... args) throws Exception
    {
        int page = 1;
        int perPage = 1000;

        while(true)
        {
            List<BeopjeongdongDto> dtoList = openApiClient.fetchDongData(page, perPage);
            if(dtoList.isEmpty())
            {
                break;
            }

            beopjeongdongService.saveAllIfNotExists(dtoList);
            page++;
        }

        System.out.println("법정동 데이터 덤핑 완료");
    }
}
