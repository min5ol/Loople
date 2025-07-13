package com.loople.backend.v1.domain.user.service;

import com.loople.backend.v1.domain.dongcode.entity.AdministrativeDong;
import com.loople.backend.v1.domain.dongcode.service.AdministrativeDongDumpService;
import com.loople.backend.v1.domain.residence.entity.Residence;
import com.loople.backend.v1.domain.residence.service.ResidenceService;
import com.loople.backend.v1.domain.user.dto.SignupRequestDto;
import com.loople.backend.v1.domain.user.entity.User;
import com.loople.backend.v1.domain.user.repository.UserRepository;
import com.loople.backend.v1.global.exception.UserNotFoundException;
import com.loople.backend.v1.global.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AdministrativeDongDumpService dongService;
    private final ResidenceService residenceService;
    private final PasswordEncoder passwordEncoder;

    /**
     * 현재 로그인한 유저의 프로필 이미지를 변경한다.
     */
    @Override
    public void updateProfileImage(String imageUrl) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        user.updateProfileImageUrl(imageUrl);
    }

    /**
     * 회원가입 로직
     * 1. 행정동 주소 코드로 매핑
     * 2. 해당 주소로 레지던스 조회 또는 생성
     * 3. 비밀번호 암호화 및 User 엔티티 저장
     */
    @Override
    public void saveUserInfo(SignupRequestDto request) {
        AdministrativeDong dong = dongService.getByAddress(
                request.getSido().trim(),
                request.getSigungu().trim(),
                request.getEupmyun().trim(),
                request.getRi() != null ? request.getRi().trim() : null
        );

        Residence residence = residenceService.findOrCreate(
                dong.getAddress(),
                dong.getRegionCode(),
                request.getGpsLat(),
                request.getGpsLng(),
                request.getResidenceName(),
                request.getRuleType()
        );

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = request.toEntity()
                .toBuilder()
                .password(encodedPassword)
                .residenceId(residence.getId())
                .build();

        userRepository.save(user);
    }
}
