package com.loople.backend.v2.domain.looplingCatalog.controller;

import com.loople.backend.v2.domain.looplingCatalog.dto.LooplingCatalogResponse;
import com.loople.backend.v2.domain.looplingCatalog.service.LooplingCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v2/looplings/catalog")
@RequiredArgsConstructor
public class LooplingCatalogController
{
    private final LooplingCatalogService looplingCatalogService;

    @GetMapping
    public ResponseEntity<List<LooplingCatalogResponse>> getAll()
    {
        return ResponseEntity.ok(looplingCatalogService.getAllLooplings());
    }
}
