package com.loople.backend.v2.domain.looplingCatalog.service;

import com.loople.backend.v2.domain.looplingCatalog.dto.LooplingCatalogResponse;
import com.loople.backend.v2.domain.looplingCatalog.repository.LooplingCatalogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LooplingCatalogServiceImpl implements LooplingCatalogService
{
    private final LooplingCatalogRepository looplingCatalogRepository;

    @Override
    public List<LooplingCatalogResponse> getAllLooplings()
    {
        return looplingCatalogRepository.findAll().stream()
                .map(l -> new LooplingCatalogResponse(
                        l.getNo(), l.getName(), l.getImageUrl(), l.getDescription()
                )).toList();
    }
}
