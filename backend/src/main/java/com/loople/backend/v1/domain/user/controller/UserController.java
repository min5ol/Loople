/**
 * 사용자 관련 컨트롤러
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.domain.user.controller;

import com.loople.backend.v1.domain.user.dto.ProfileImageRequestDto;
import com.loople.backend.v1.domain.user.dto.SignupRequestDto;
import com.loople.backend.v1.domain.user.service.UserService;
import com.loople.backend.v1.global.s3.PresignedUrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * 사용자 요청 처리
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService; // 사용자 서비스
    private final PresignedUrlService presignedUrlService;

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

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("name") String name,
            @RequestParam("nickname") String nickname,
            @RequestParam("phone") String phone,
            @RequestParam("sido") String sido,
            @RequestParam("sigungu") String sigungu,
            @RequestParam("eupmyun") String eupmyun,
            @RequestParam("detailAddress") String detailAddress,
            @RequestParam(value = "profileImageUrl", required = false) MultipartFile requestImageUrl) {
        String profileImageUrl;

        System.out.println("requestImageUrl = " + requestImageUrl);

        // 프로필 이미지가 있으면 저장
        if (requestImageUrl != null && !requestImageUrl.isEmpty()) {
            String fileName = requestImageUrl.getOriginalFilename();
            profileImageUrl = presignedUrlService.generatePresignedUrl(fileName);
        } else{
            profileImageUrl = null;
        }

        SignupRequestDto signupRequestDto = new SignupRequestDto(
                email, profileImageUrl, password, name, nickname, phone, sido, sigungu, eupmyun, detailAddress);

        try{
            userService.saveUserInfo(signupRequestDto);
            return ResponseEntity.ok("회원 가입 성공");
        } catch (Exception e){
            return ResponseEntity.status(500).body("회원 가입 실패: " + e.getMessage());
        }
    }

}
