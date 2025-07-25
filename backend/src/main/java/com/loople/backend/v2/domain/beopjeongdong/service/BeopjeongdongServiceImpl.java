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

import java.util.List;

@Service
@RequiredArgsConstructor
public class BeopjeongdongServiceImpl implements BeopjeongdongService
{
    private final BeopjeongdongRepository beopjeongdongRepository;

    @Override
    public String getDongCode(String sido, String sigungu, String eupmyun, String ri)
    {
        return getBeopjeongdong(sido, sigungu, eupmyun, ri).getDongCode();
    }

    @Override
    public Beopjeongdong getBeopjeongdong(String sido, String sigungu, String eupmyun, String ri)
    {
        return beopjeongdongRepository.findBySidoAndSigunguAndEupmyunAndRi(
                sido, sigungu, eupmyun, ri
        ).orElseThrow(() -> new IllegalArgumentException("해당 주소에 대한 법정동 코드가 없습니다."));
    }

    @Override
    public void saveAllIfNotExists(List<BeopjeongdongDto> dtoList)
    {
        for(BeopjeongdongDto dto : dtoList)
        {
            boolean exists = beopjeongdongRepository.existsByDongCode(dto.dongCode());
            if(!exists)
            {
                Beopjeongdong entity = Beopjeongdong.builder()
                        .sido(dto.sido())
                        .sigungu(dto.sigungu())
                        .eupmyun(dto.eupmeyon())
                        .ri(dto.ri())
                        .dongCode(dto.dongCode())
                        .build();
                beopjeongdongRepository.save(entity);
            }
        }
    }
}