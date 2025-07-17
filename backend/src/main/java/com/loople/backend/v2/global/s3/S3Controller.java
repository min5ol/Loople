package com.loople.backend.v2.global.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/v2/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    @GetMapping("/presigned-url")
    public String getPresignedUrl(@RequestParam String fileName, @RequestParam String contentType) {
        String decodedFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);
        return s3Service.createPresignedUrl(decodedFileName, contentType);
    }
}
