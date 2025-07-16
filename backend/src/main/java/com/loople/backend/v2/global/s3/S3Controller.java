package com.loople.backend.v2.global.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/s3")
@RequiredArgsConstructor
public class S3Controller
{
    private final S3Service s3Service;

    @GetMapping("/presigned-url")
    public String getPresignedUrl(@RequestParam String fileName,
                                  @RequestParam String contentType)
    {
        return s3Service.createPresignedUrl(fileName, contentType);
    }
}
