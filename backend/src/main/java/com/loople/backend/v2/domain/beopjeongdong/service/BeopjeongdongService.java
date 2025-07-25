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

public interface BeopjeongdongService
{
    String getDongCode(String sido, String sigungu, String eupmyun, String ri);
    Beopjeongdong getBeopjeongdong(String sido, String sigungu, String eupmyun, String ri);
    void saveAllIfNotExists(List<BeopjeongdongDto> dtoList);
}