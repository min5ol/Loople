/**
 * 사용자 서비스 구현체
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.domain.user.service;

import com.loople.backend.v1.domain.dongcode.entity.AdministrativeDong;
import com.loople.backend.v1.domain.dongcode.service.AdministrativeDongDumpService;
import com.loople.backend.v1.domain.user.dto.SignupRequestDto;
import com.loople.backend.v1.domain.user.entity.User;
import com.loople.backend.v1.domain.user.repository.UserRepository;
import com.loople.backend.v1.global.exception.UserNotFoundException;
import com.loople.backend.v1.global.s3.PresignedUrlService;
import com.loople.backend.v1.global.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 사용자 관련 비즈니스 로직 처리
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository; // 사용자 리포지토리
    private final PresignedUrlService presignedUrlService;
    private final AdministrativeDongDumpService dongService;

    /**
     * 프로필 이미지 수정
     * @param imageUrl - 저장할 이미지 URL
     */
    @Override
    public void updateProfileImage(String imageUrl) {
        Long userId = SecurityUtil.getCurrentUserId(); // 현재 사용자 ID 조회

        User user = userRepository.findById(userId) // 사용자 조회
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId)); // 없으면 예외

        user.updateProfileImageUrl(imageUrl); // 프로필 이미지 URL 변경
    }

    @Override
    public void saveUserInfo(SignupRequestDto request) {
        String presignedUrl = presignedUrlService.generatePresignedUrl(request.getProfileImageUrl());
        if (request.getProfileImageUrl() != null && !request.getProfileImageUrl().isEmpty()) {
            presignedUrl = presignedUrlService.generatePresignedUrl(request.getProfileImageUrl());
        }
        String Code = dongService.getBeopjeongCodeByAddress(request.getSido(), request.getSigungu(), request.getEupmyun()).getDongCode();
        Long dongCode = Long.valueOf(Code);

        User user = request.toEntity();
        user.updateProfileImageUrl(presignedUrl);
        user.updateResidenceId(dongCode);
        userRepository.save(user);
    }
}
