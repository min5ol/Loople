package com.loople.backend.v2.domain.regionalRule.service;

import com.loople.backend.v2.domain.beopjeongdong.repository.BeopjeongdongRepository;
import com.loople.backend.v2.domain.chat.dto.LocalGovenmentWasteInfoResponse;
import com.loople.backend.v2.domain.chat.entity.LocalGovernmentWasteInfo;
import com.loople.backend.v2.domain.chat.repository.LocalGovernmentWasteInfoRepository;
import com.loople.backend.v2.domain.regionalRule.dto.RegionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RuleServiceImpl implements RuleService{
    private final BeopjeongdongRepository beopjeongdongRepository;
    private final LocalGovernmentWasteInfoRepository localGovernmentWasteInfoRepository;

    private boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    @Override
    public List<String> getRegion(RegionRequest regionRequest) {
        System.out.println("regionRequest = " + regionRequest);
        if (isNullOrEmpty(regionRequest.getSido())) {
            return beopjeongdongRepository.findDistinctSido();
        } else if (isNullOrEmpty(regionRequest.getSigungu())) {
            return beopjeongdongRepository.findDistinctSigunguBySido(regionRequest.getSido());
        } else if (isNullOrEmpty(regionRequest.getEupmyun())) {
            return beopjeongdongRepository.findDistinctEupmyunBySigungu(regionRequest.getSigungu());
        } else {
            return beopjeongdongRepository.findDistinctRiByEupmyun(regionRequest.getEupmyun());
        }
    }

    @Override
    public List<LocalGovenmentWasteInfoResponse> getRule(RegionRequest regionRequest) {
        System.out.println("regionRequest = " + regionRequest);
        return localGovernmentWasteInfoRepository
                .findBySidoAndSigungu(regionRequest.getSido(), regionRequest.getSigungu())
                .stream()
                .map(localInfo -> LocalGovenmentWasteInfoResponse.builder()
                        .sido(localInfo.getSido())
                        .sigungu(localInfo.getSigungu())
                        .homepage(localInfo.getHomepage())
                        .allInfoUrl(localInfo.getAllInfoUrl())
                        .generalUrl(localInfo.getGeneralUrl())
                        .foodUrl(localInfo.getFoodUrl())
                        .recyclingUrl(localInfo.getRecyclingUrl())
                        .bulkyUrl(localInfo.getBulkyUrl())
                        .wasteType(localInfo.getWasteType())
                        .disposalTime(localInfo.getDisposalTime())
                        .disposalDays(localInfo.getDisposalDays())
                        .collectionSchedule(localInfo.getCollectionSchedule())
                        .disposalLocation(localInfo.getDisposalLocation())
                        .disposalMethod(localInfo.getDisposalMethod())
                        .notes(localInfo.getNotes())
                        .imgUrl(localInfo.getImgUrl())
                        .build()
                )
                .collect(Collectors.toList());
    }

}
