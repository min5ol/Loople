package com.loople.backend.v1.domain.user.controller;

import com.loople.backend.v1.domain.user.dto.ProfileImageRequestDto;
import com.loople.backend.v1.domain.user.dto.SignupRequestDto;
import com.loople.backend.v1.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @PostMapping("/profile-image")
    public ResponseEntity<Void> saveProfileImage(@RequestBody ProfileImageRequestDto request) {
        userService.updateProfileImage(request.getImageUrl());
        return ResponseEntity.ok().build();
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
            @RequestParam(value = "ri", required = false) String ri,
            @RequestParam("detailAddress") String detailAddress,
            @RequestParam("gpsLat") Double gpsLat, // 추가
            @RequestParam("gpsLng") Double gpsLng, // 추가
            @RequestBody(required = false) ProfileImageRequestDto profileImageDto
    ) {
        String profileImageUrl = (profileImageDto != null && profileImageDto.getImageUrl() != null)
                ? profileImageDto.getImageUrl()
                : "https://loople-dev.s3.ap-southeast-2.amazonaws.com/user_basic_profile.png";

        SignupRequestDto signupRequestDto = new SignupRequestDto(
                email,
                profileImageUrl,
                password,
                name,
                nickname,
                phone,
                sido,
                sigungu,
                eupmyun,
                ri,
                detailAddress,
                gpsLat,
                gpsLng
        );

        try {
            userService.saveUserInfo(signupRequestDto);
            return ResponseEntity.ok("회원 가입 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("회원 가입 실패: " + e.getMessage());
        }
    }
}
