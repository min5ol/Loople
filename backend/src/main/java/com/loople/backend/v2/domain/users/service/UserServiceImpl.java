package com.loople.backend.v2.domain.users.service;

import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import com.loople.backend.v2.domain.beopjeongdong.service.BeopjeongdongService;
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
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BeopjeongdongService beopjeongdongService;
    private final UserNotificationRepository userNotificationRepository;
    private final VillageStatusRepository villageStatusRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserSignupResponse signup(UserSignupRequest request) {

        // 1. 이메일 중복 확인
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        // 2. 동코드 조회 (서비스를 통해)
        String dongCode = beopjeongdongService.getDongCode(
                request.sido(),
                request.sigungu(),
                request.eupmyun(),
                request.ri()
        );

        // 3. 법정동 정보 가져오기
        Beopjeongdong dong = beopjeongdongService.findByDongCode(dongCode)
                .orElseThrow(() -> new IllegalArgumentException("법정동 정보를 찾을 수 없습니다."));

        // 4. 전체 주소 조합
        String fullAddress = String.join(" ",
                request.sido(),
                request.sigungu(),
                request.eupmyun(),
                request.ri() == null ? "" : request.ri()
        ).trim();

        // 5. 유저 생성
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .name(request.name())
                .nickname(request.nickname())
                .phone(request.phone())
                .beopjeongdong(dong)
                .address(fullAddress)
                .detailAddress(request.detailAddress())
                .profileImageUrl(request.profileImageUrl())
                .role(Role.USER)
                .provider(Provider.LOCAL)
                .build();

        userRepository.save(user);

        // 6. 알림 설정 초기화
        userNotificationRepository.save(UserNotification.of(user));

        // 7. 마을 상태 초기화
        if (!villageStatusRepository.existsByDongCode(dong.getDongCode())) {
            villageStatusRepository.save(new VillageStatus(dong.getDongCode(), 1, 0, null));
        }

        return new UserSignupResponse(user.getNo(), user.getNickname());
    }
}
