package com.loople.backend.v1.domain.user.service;

import com.loople.backend.v1.domain.user.dto.SignupRequestDto;

public interface UserService {
    void updateProfileImage(String imageUrl);
    void saveUserInfo(SignupRequestDto request);
}
