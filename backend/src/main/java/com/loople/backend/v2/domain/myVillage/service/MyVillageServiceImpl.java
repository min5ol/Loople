package com.loople.backend.v2.domain.myVillage.service;

import com.loople.backend.v2.domain.myVillage.entity.MyVillage;
import com.loople.backend.v2.domain.myVillage.repository.MyVillageRepository;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.villageStatus.entity.VillageStatus;
import com.loople.backend.v2.domain.villageStatus.repository.VillageStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyVillageServiceImpl implements MyVillageService
{
    private final MyVillageRepository myVillageRepository;
    private final VillageStatusRepository villageStatusRepository;

    @Override
    public MyVillage assignVillage(User user, String dongCodePrefix)
    {
        VillageStatus status = villageStatusRepository.findByDongCodePrefix(dongCodePrefix)
                .orElseGet(() -> {
                    VillageStatus newStatus = VillageStatus.builder()
                            .dongCodePrefix(dongCodePrefix)
                            .population(1)
                            .totalPoints(0)
                            .build();
                    return villageStatusRepository.save(newStatus);
                });

        MyVillage myVillage = MyVillage.builder()
                .user(user)
                .villageStatus(status)
                .isEquipped(true)
                .build();

        return myVillageRepository.save(myVillage);
    }
}
