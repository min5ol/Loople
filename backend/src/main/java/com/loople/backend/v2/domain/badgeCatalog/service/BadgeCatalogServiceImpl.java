package com.loople.backend.v2.domain.badgeCatalog.service;

import com.loople.backend.v2.domain.badgeCatalog.dto.BadgeCatalogResponse;
import com.loople.backend.v2.domain.badgeCatalog.repository.BadgeCatalogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BadgeCatalogServiceImpl implements BadgeCatalogService
{
    private final BadgeCatalogRepository badgeCatalogRepository;

    @Override
    public List<BadgeCatalogResponse> getAllBadges()
    {
        return badgeCatalogRepository.findAll()
                .stream()
                .map(badge -> new BadgeCatalogResponse(
                        badge.getNo(),
                        badge.getBadgeName(),
                        badge.getDescription(),
                        badge.getImageUrl(),
                        badge.getPointRequirement()
                ))
                .toList();
    }
}
