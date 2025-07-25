package com.loople.backend.v2.domain.myBadge.controller;

import com.loople.backend.v2.domain.myBadge.dto.MyBadgeResponse;
import com.loople.backend.v2.domain.myBadge.service.MyBadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/my-badges")
@RequiredArgsConstructor
public class MyBadgeController
{
    private final MyBadgeService myBadgeService;

    @GetMapping("/{userNo}")
    public ResponseEntity<List<MyBadgeResponse>> getMyBadges(@PathVariable Long userNo)
    {
        return ResponseEntity.ok(myBadgeService.getMyBadges(userNo));
    }

    @PostMapping("/{userNo}/equip/{badgeNo}")
    public ResponseEntity<Void> equipBadge(
            @PathVariable Long userNo,
            @PathVariable Long badgeNo)
    {
        myBadgeService.equipBadge(userNo, badgeNo);

        return ResponseEntity.ok().build();
    }
}
