/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 법정동 서비스 구현체
 *       - API로 가져온 법정동 목록을 중복 없이 저장
 *       - 주소로부터 동코드 조회
 *       - 동코드로 엔티티 조회
 */

package com.loople.backend.v2.domain.beopjeongdong.service;

import com.loople.backend.v2.domain.beopjeongdong.dto.BeopjeongdongDto;
import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import com.loople.backend.v2.domain.beopjeongdong.repository.BeopjeongdongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BeopjeongdongServiceImpl implements BeopjeongdongService {

    private final BeopjeongdongRepository repository; // DB 접근 레포지토리

    /**
     * 주어진 DTO 리스트를 순회하며 DB에 저장
     * 이미 존재하거나 필수값이 누락된 경우는 건너뜀
     */
    @Override
    @Transactional
    public void saveAllIfNotExists(List<BeopjeongdongDto> dtoList) {
        for (BeopjeongdongDto dto : dtoList) {
            // 필수값 null 체크 + 중복 방지
            if (
                    dto.dongCode() == null ||
                            dto.sido() == null ||
                            dto.sigungu() == null ||
                            dto.eupmeyon() == null ||
                            repository.existsByDongCode(dto.dongCode())
            ) {
                continue;
            }

            // 엔티티 생성 및 저장
            repository.save(Beopjeongdong.builder()
                    .dongCode(dto.dongCode())
                    .sido(dto.sido())
                    .sigungu(dto.sigungu())
                    .eupmyun(dto.eupmeyon())
                    .ri(dto.ri())
                    .createdAt(LocalDateTime.now())
                    .build());
        }
    }

    /**
     * 주소 정보(sido, sigungu, eupmyun, ri)로 법정동 엔티티 조회
     * ri가 null 또는 공백이면 제외하고 조회
     */
    @Override
    @Transactional(readOnly = true)
    public Beopjeongdong getDongByAddressParts(String sido, String sigungu, String eupmyun, String ri) {
        return repository.findByParts(sido, sigungu, eupmyun, isBlank(ri) ? null : ri)
                .orElseThrow(() -> new IllegalArgumentException("주소에 해당하는 동코드를 찾을 수 없습니다."));
    }

    /**
     * dongCode로 법정동 엔티티 Optional 조회
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Beopjeongdong> findByDongCode(String dongCode) {
        return repository.findByDongCode(dongCode);
    }

    // 문자열 null 또는 공백 여부 판단
    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    /**
     * 주소 정보로부터 동코드(String)만 반환
     */
    @Override
    @Transactional(readOnly = true)
    public String getDongCode(String sido, String sigungu, String eupmyun, String ri) {
        return getDongByAddressParts(sido, sigungu, eupmyun, ri).getDongCode();
    }
}