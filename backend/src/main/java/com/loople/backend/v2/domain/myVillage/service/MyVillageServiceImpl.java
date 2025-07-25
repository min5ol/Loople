package com.loople.backend.v2.domain.myVillage.service;

import com.loople.backend.v2.domain.myVillage.entity.MyVillage;
import com.loople.backend.v2.domain.myVillage.repository.MyVillageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyVillageServiceImpl implements MyVillageService
{
    private final MyVillageRepository myVillageRepository;

    @Override
    public MyVillage assignVillage(String dongCode)
    {
        String prefix = dongCode.substring(0,8);

        return myVillageRepository.findByDongCodePrefix(prefix)
                .orElseGet(() -> myVillageRepository.save(
                        MyVillage.builder()
                                .dongCodePrefix(prefix)
                                .build()
                ));
    }
}
