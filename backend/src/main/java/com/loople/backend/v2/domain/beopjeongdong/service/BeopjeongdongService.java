/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 법정동 데이터를 저장하는 서비스 계층의 인터페이스
 */
package com.loople.backend.v2.domain.beopjeongdong.service;

import com.loople.backend.v2.domain.beopjeongdong.dto.BeopjeongdongDto;

import java.util.List;

public interface BeopjeongdongService
{
    void saveAllIfNotExists(List<BeopjeongdongDto> dtoList);
    String getDongCode(String sido, String sigungu, String eupmyun, String ri);
}
