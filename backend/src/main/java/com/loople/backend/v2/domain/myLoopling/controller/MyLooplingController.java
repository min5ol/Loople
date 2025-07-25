package com.loople.backend.v2.domain.myLoopling.controller;

import com.loople.backend.v2.domain.myLoopling.dto.MyLooplingResponse;
import com.loople.backend.v2.domain.myLoopling.service.MyLooplingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/my-looplings")
@RequiredArgsConstructor
public class MyLooplingController
{
    private final MyLooplingService myLooplingService;

    @GetMapping("/{userNo}")
    public ResponseEntity<List<MyLooplingResponse>> getMyLooplings(@PathVariable Long userNo)
    {
        return ResponseEntity.ok(myLooplingService.getMyLoopling(userNo));
    }

    @PostMapping("/{userNo}/equip/{looplingId}")
    public ResponseEntity<Void> equipLoopling(
            @PathVariable Long userNo,
            @PathVariable Long looplingId)
    {
        myLooplingService.equipLoopling(userNo, looplingId);
        return ResponseEntity.ok().build();
    }
}
