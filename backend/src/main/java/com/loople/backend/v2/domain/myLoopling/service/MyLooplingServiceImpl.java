package com.loople.backend.v2.domain.myLoopling.service;

import com.loople.backend.v2.domain.looplingCatalog.entity.LooplingCatalog;
import com.loople.backend.v2.domain.looplingCatalog.repository.LooplingCatalogRepository;
import com.loople.backend.v2.domain.myLoopling.dto.MyLooplingResponse;
import com.loople.backend.v2.domain.myLoopling.entity.MyLoopling;
import com.loople.backend.v2.domain.myLoopling.repository.MyLooplingRepository;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.global.exception.CustomException;
import com.loople.backend.v2.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyLooplingServiceImpl implements MyLooplingService
{
    private final MyLooplingRepository myLooplingRepository;
    private final LooplingCatalogRepository looplingCatalogRepository;

    @Override
    public List<MyLooplingResponse> getMyLoopling(Long userNo)
    {
        return myLooplingRepository.findByUser_No(userNo).stream()
                .map(m -> new MyLooplingResponse(
                        m.getLoopling().getNo(),
                        m.getLoopling().getName(),
                        m.getLoopling().getImageUrl(),
                        m.getLoopling().getDescription(),
                        m.isEquipped()
                )).toList();
    }

    @Override
    public void equipLoopling(Long userNo, Long looplingId)
    {
        MyLoopling current = myLooplingRepository.findByUser_NoAndIsEquippedTrue(userNo).orElse(null);

        if(current != null) current.unEquip();

        MyLoopling toEquip = myLooplingRepository.findById(looplingId)
                .orElseThrow(() -> new IllegalArgumentException("루플링을 찾을 수 없습니다."));
        toEquip.equip();
    }

    @Override
    public MyLoopling assignLoopling(User user, Long catalogId)
    {
        LooplingCatalog catalog = looplingCatalogRepository.findById(catalogId)
                .orElseThrow(() -> new CustomException(ErrorCode.LOOPLING_NOT_FOUND));

        MyLoopling myLoopling = MyLoopling.builder()
                .user(user)
                .loopling(catalog)
                .isEquipped(true)
                .build();

        return myLooplingRepository.save(myLoopling);
    }
}
