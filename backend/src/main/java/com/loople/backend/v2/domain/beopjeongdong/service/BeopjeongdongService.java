/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 법정동 데이터를 저장하고 조회하는 서비스 계층의 인터페이스
 *       - 외부 API → DB 저장
 *       - 주소 정보 기반 동코드 조회 기능 제공
 */

package com.loople.backend.v2.domain.beopjeongdong.service;

import com.loople.backend.v2.domain.beopjeongdong.dto.BeopjeongdongDto;
import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;

import java.util.List;
import java.util.Optional;

public interface BeopjeongdongService {

    // 주어진 법정동 목록을 DB에 저장 (이미 존재하는 동코드는 제외)
    void saveAllIfNotExists(List<BeopjeongdongDto> dtoList);

    // 주소 정보(sido, sigungu, eupmyun, ri)를 통해 dongCode(법정동 코드)를 반환
    String getDongCode(String sido, String sigungu, String eupmyun, String ri);

    // dongCode를 통해 법정동 엔티티를 Optional로 조회
    Optional<Beopjeongdong> findByDongCode(String dongCode);

    // 주소 4단계로 정확히 일치하는 법정동 엔티티 반환 (없을 시 예외 발생 가능)
    Beopjeongdong getDongByAddressParts(String sido, String sigungu, String eupmyun, String ri);
}