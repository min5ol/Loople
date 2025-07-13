/**
 * 행정동 덤프 실행 러너
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.domain.dongcode.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 시작 시 덤프 실행
 */
// @Component // 자동 러너 되기때문에 덤핑 시에만 주석 해제
@RequiredArgsConstructor
public class AdministrativeDongDumpRunner implements CommandLineRunner {

    private final AdministrativeDongDumpService dumpService; // 덤프 서비스

    /**
     * 애플리케이션 시작 시 실행
     * @param args - 실행 파라미터
     * @throws Exception - 덤프 실패 시
     */
    @Override
    public void run(String... args) throws Exception {
        dumpService.dump(); // 덤프 실행
    }
}
