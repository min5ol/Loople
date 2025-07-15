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

    @Override
    @Transactional
    public void saveAllIfNotExists(List<BeopjeongdongDto> dtoList) {
        for (BeopjeongdongDto dto : dtoList) {
            if (
                    dto.dongCode() == null ||
                            dto.sido() == null ||
                            dto.sigungu() == null ||
                            dto.eupmeyon() == null ||
                            repository.existsByDongCode(dto.dongCode())
            ) {
                continue;
            }

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
