package com.loople.backend.v2.domain.badgeCatalog.controller;

import com.loople.backend.v2.domain.badgeCatalog.dto.BadgeCatalogResponse;
import com.loople.backend.v2.domain.badgeCatalog.service.BadgeCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v2/badges")
@RequiredArgsConstructor
public class BadgeCatalogController
{
    private final BadgeCatalogService badgeCatalogService;

    @GetMapping("/catalog")
    public ResponseEntity<List<BadgeCatalogResponse>> getAllBadges()
    {
        List<BadgeCatalogResponse> badges = badgeCatalogService.getAllBadges();

        return ResponseEntity.ok(badges);
    }
}
