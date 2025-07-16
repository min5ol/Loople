/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 법정동 DTO 데이터를 받아 중복 여부 확인 후 DB에 저장하는 서비스 구현체
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

@Service
@RequiredArgsConstructor
public class BeopjeongdongServiceImpl implements BeopjeongdongService
{
    private final BeopjeongdongRepository repository;

    /**
     * API로 받은 법정동 리스트 중 중복되지 않는 항목만 저장
     */

    @Override
    @Transactional
    public void saveAllIfNotExists(List<BeopjeongdongDto> dtoList) {
        for (BeopjeongdongDto dto : dtoList) {
            // 필수값 없거나 이미 존재하는 동코드는 skip
            if (
                    dto.dongCode() == null ||
                            dto.sido() == null ||
                            dto.sigungu() == null ||
                            dto.eupmeyon() == null ||
                            repository.existsByDongCode(dto.dongCode())
            ) {
                continue;
            }

            // 새 동 저장
            repository.save(Beopjeongdong.builder()
                    .sido(dto.sido())
                    .sigungu(dto.sigungu())
                    .eupmyun(dto.eupmeyon())
                    .ri(dto.ri())
                    .dongCode(dto.dongCode())
                    .createdAt(LocalDateTime.now())
                    .build());
        }
    }
}
