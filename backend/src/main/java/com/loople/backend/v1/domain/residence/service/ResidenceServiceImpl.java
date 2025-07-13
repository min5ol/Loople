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
    public Residence findOrCreate(String address, String regionCode, double gpsLat, double gpsLng, String name, String ruleTypeStr) {
        Optional<Residence> existing = residenceRepository.findByAddressAndRegionCode(address.trim(), regionCode.trim());
        if (existing.isPresent()) return existing.get();

        String safeName = (name == null || name.trim().isEmpty()) ? "기타" : name.trim();
        RuleType ruleType;
        try {
            ruleType = RuleType.valueOf(ruleTypeStr != null ? ruleTypeStr.toUpperCase() : "ETC");
        } catch (IllegalArgumentException e) {
            ruleType = RuleType.ETC;
        }

        Residence residence = Residence.builder()
                .name(safeName)
                .address(address)
                .regionCode(regionCode)
                .gpsLat(gpsLat)
                .gpsLng(gpsLng)
                .ruleType(ruleType)
                .description(null)
                .build();

        return residenceRepository.save(residence);
    }
}
