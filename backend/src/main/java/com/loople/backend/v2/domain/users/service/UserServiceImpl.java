/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: UserService 인터페이스의 구현체 일반 회원가입 로직 처리
 */

package com.loople.backend.v2.domain.users.service;

import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import com.loople.backend.v2.domain.beopjeongdong.repository.BeopjeongdongRepository;
import com.loople.backend.v2.domain.userNotification.entity.UserNotification;
import com.loople.backend.v2.domain.userNotification.repository.UserNotificationRepository;
import com.loople.backend.v2.domain.users.dto.UserSignupRequest;
import com.loople.backend.v2.domain.users.dto.UserSignupResponse;
import com.loople.backend.v2.domain.users.entity.Provider;
import com.loople.backend.v2.domain.users.entity.Role;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import com.loople.backend.v2.domain.villageStatus.entity.VillageStatus;
import com.loople.backend.v2.domain.villageStatus.repository.VillageStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService
{
    private final UserRepository userRepository;
    private final BeopjeongdongRepository beopjeongdongRepository;
    private final UserNotificationRepository userNotificationRepository;
    private final VillageStatusRepository villageStatusRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserSignupResponse signup(UserSignupRequest request)
    {
        if(userRepository.findByEmail(request.email()).isPresent())
        {
            throw new IllegalArgumentException("이미 가입된 이메일 입니다.");
        }

        Beopjeongdong dong = beopjeongdongRepository.findByDongCode(request.dongCode())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 동코드 입니다."));

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .name(request.name())
                .nickname(request.nickname())
                .phone(request.phone())
                .beopjeongdong(dong)
                .address(request.address())
                .detailAddress(request.detailAddress())
                .profileImageUrl(request.profileImageUrl())
                .role(Role.USER)
                .provider(Provider.LOCAL)
                .build();

        userRepository.save(user);
        userNotificationRepository.save(UserNotification.of(user));

        if(!villageStatusRepository.existsByDongCode(request.dongCode()))
        {
            villageStatusRepository.save(new VillageStatus(request.dongCode(), 1, 0, null));
        }

        return new UserSignupResponse(user.getNo(), user.getNickname());
    }
}
