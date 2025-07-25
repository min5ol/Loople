/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 애플리케이션 시작 시 공공데이터 포털의 법정동 API를 호출하여 전체 동 정보를 가져오고,
 *       DB에 중복 없이 저장하는 CommandLineRunner
 */

package com.loople.backend.v2.domain.beopjeongdong.runner;

import com.loople.backend.v2.domain.beopjeongdong.dto.BeopjeongdongDto;
import com.loople.backend.v2.domain.beopjeongdong.infra.BeopjeongdongOpenApiClient;
import com.loople.backend.v2.domain.beopjeongdong.service.BeopjeongdongService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

// DB 초기화를 위한 러너. 운영 시 주석 해제 필요
@Component
@RequiredArgsConstructor
public class BeopjeongdongImporterRunner implements CommandLineRunner {

    private final BeopjeongdongOpenApiClient openApiClient; // 외부 API 클라이언트
    private final BeopjeongdongService beopjeongdongService; // 저장 처리 서비스

    @Override
    public void run(String... args) throws Exception {
        int page = 1;           // 시작 페이지
        int perPage = 1000;     // 페이지당 항목 수

        // 페이지 단위로 반복 조회
        while (true) {
            // API 호출하여 해당 페이지의 동 목록 가져오기
            List<BeopjeongdongDto> dtoList = openApiClient.fetchDongData(page, perPage);

            // 결과가 없으면 루프 종료
            if (dtoList.isEmpty()) {
                break;
            }

            // 중복되지 않는 경우에만 저장
            beopjeongdongService.saveAllIfNotExists(dtoList);

            // 다음 페이지로 이동
            page++;
        }

        // 완료 로그 출력
        System.out.println("법정동 데이터 덤핑 완료");
    }
}