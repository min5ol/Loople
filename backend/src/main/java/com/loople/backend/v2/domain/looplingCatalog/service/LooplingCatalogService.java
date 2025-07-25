package com.loople.backend.v2.domain.looplingCatalog.service;

import com.loople.backend.v2.domain.looplingCatalog.dto.LooplingCatalogResponse;

import java.util.List;

public interface LooplingCatalogService
{
    List<LooplingCatalogResponse> getAllLooplings();
}
