package com.loople.backend.v1.global.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/s3")
@RequiredArgsConstructor
public class PresignedUrlController {

    private final PresignedUrlService presignedUrlService;

    @GetMapping("/presigned-url")
    public ResponseEntity<String> getPresignedUrl(@RequestParam String fileName) {
        if (fileName == null || fileName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("fileName is required");
        }

        String contentType = fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") ? "image/jpeg" :
                fileName.endsWith(".webp") ? "image/webp" : "image/png";

        String url = presignedUrlService.generatePresignedUrl(fileName, contentType);
        return ResponseEntity.ok(url);
    }
}
