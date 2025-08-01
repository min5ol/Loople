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

    @Override
    public List<String> getSido() {
//        List<String> tempSido = localGovernmentWasteInfoRepository.findDistinctSido();
//        tempSido.forEach(t -> System.out.println("t = " + t));

        return beopjeongdongRepository.findDistinctSido();
    }

    @Override
    public List<String> getSigungu(String sido) {
        return beopjeongdongRepository.findDistinctSigunguBySido(sido);
    }

    @Override
    public List<String> getEupmyun(String sigungu) {
        return beopjeongdongRepository.findDistinctEupmyunBySigungu(sigungu);
    }

    @Override
    public List<String> getRi(String eupmyun) {
        return beopjeongdongRepository.findDistinctRiByEupmyun(eupmyun);
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
