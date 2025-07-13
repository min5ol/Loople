package com.loople.backend.v1.domain.residence.service;

import com.loople.backend.v1.domain.residence.entity.Residence;
import com.loople.backend.v1.domain.residence.entity.RuleType;
import com.loople.backend.v1.domain.residence.repository.ResidenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResidenceServiceImpl implements ResidenceService {

    private final ResidenceRepository residenceRepository;

    @Override
    public Residence findOrCreate(String address, String regionCode, double gpsLat, double gpsLng) {
        Optional<Residence> existing = residenceRepository.findByAddressAndRegionCode(address.trim(), regionCode.trim());
        if (existing.isPresent()) return existing.get();

        Residence residence = Residence.builder()
                .name(null) // 필요 시 로직으로 추출하거나 추가
                .address(address)
                .regionCode(regionCode)
                .gpsLat(gpsLat)
                .gpsLng(gpsLng)
                .ruleType(RuleType.ETC) // 임시 기본값
                .description(null)
                .build();

        return residenceRepository.save(residence);
    }
}
