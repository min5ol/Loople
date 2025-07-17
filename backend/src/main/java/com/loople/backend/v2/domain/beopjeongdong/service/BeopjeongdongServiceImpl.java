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
                    .dongCode(dto.dongCode())
                    .sido(dto.sido())
                    .sigungu(dto.sigungu())
                    .eupmyun(dto.eupmeyon())
                    .ri(dto.ri())
                    .createdAt(LocalDateTime.now())
                    .build());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Beopjeongdong getDongByAddressParts(String sido, String sigungu, String eupmyun, String ri) {
        return repository.findByParts(sido, sigungu, eupmyun, isBlank(ri) ? null : ri)
                .orElseThrow(() -> new IllegalArgumentException("주소에 해당하는 동코드를 찾을 수 없습니다."));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Beopjeongdong> findByDongCode(String dongCode) {
        return repository.findByDongCode(dongCode);
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    @Override
    @Transactional(readOnly = true)
    public String getDongCode(String sido, String sigungu, String eupmyun, String ri) {
        return getDongByAddressParts(sido, sigungu, eupmyun, ri).getDongCode();
    }
}
