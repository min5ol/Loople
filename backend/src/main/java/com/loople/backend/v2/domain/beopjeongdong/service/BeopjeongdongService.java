package com.loople.backend.v2.domain.beopjeongdong.service;

import com.loople.backend.v2.domain.beopjeongdong.dto.BeopjeongdongDto;

import java.util.List;

public interface BeopjeongdongService
{
    void saveAllIfNotExists(List<BeopjeongdongDto> dtoList);
}
