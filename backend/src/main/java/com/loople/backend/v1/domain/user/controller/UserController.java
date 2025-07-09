/**
 * 사용자 관련 컨트롤러
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.domain.user.controller;

import com.loople.backend.v1.domain.user.dto.ProfileImageRequestDto;
import com.loople.backend.v1.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 사용자 요청 처리
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService; // 사용자 서비스

    /**
     * 프로필 이미지 저장 요청
     * @param request - 프로필 이미지 URL DTO
     * @return 성공 시 200 OK 반환
     * 반환: { "status": 200, "message": "성공" }
     */
    @PostMapping("/profile-image")
    public ResponseEntity<Void> saveProfileImage(@RequestBody ProfileImageRequestDto request) {
        userService.updateProfileImage(request.getImageUrl()); // 프로필 이미지 저장 처리
        return ResponseEntity.ok().build(); // 성공 응답
    }
}
