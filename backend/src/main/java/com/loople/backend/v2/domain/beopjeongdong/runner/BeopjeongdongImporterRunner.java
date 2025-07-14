package com.loople.backend.v2.domain.beopjeongdong.runner;

import com.loople.backend.v2.domain.beopjeongdong.dto.BeopjeongdongDto;
import com.loople.backend.v2.domain.beopjeongdong.infra.BeopjeongdongOpenApiClient;
import com.loople.backend.v2.domain.beopjeongdong.service.BeopjeongdongService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
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
