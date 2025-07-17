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
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
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
        long start = System.currentTimeMillis();
        log.info("[회원가입] 시작");

        // 1. 이메일 중복 확인
        if (userRepository.findByEmail(request.email()).isPresent()) {
            log.warn("[회원가입] 이메일 중복: {}ms", System.currentTimeMillis() - start);
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        log.info("[회원가입] 이메일 중복 확인 완료: {}ms", System.currentTimeMillis() - start);

        // 2. 동코드 조회
        String dongCode = beopjeongdongService.getDongCode(
                request.sido(), request.sigungu(), request.eupmyun(), request.ri());
        log.info("[회원가입] 동코드 조회 완료: {}ms", System.currentTimeMillis() - start);

        // 3. 법정동 정보 가져오기
        Beopjeongdong dong = beopjeongdongService.findByDongCode(dongCode)
                .orElseThrow(() -> {
                    log.warn("[회원가입] 법정동 정보 없음: {}ms", System.currentTimeMillis() - start);
                    return new IllegalArgumentException("법정동 정보를 찾을 수 없습니다.");
                });
        log.info("[회원가입] 법정동 조회 완료: {}ms", System.currentTimeMillis() - start);

        // 4. 주소 조합
        String fullAddress = String.join(" ",
                request.sido(),
                request.sigungu(),
                request.eupmyun(),
                request.ri() == null ? "" : request.ri()
        ).trim();

        // 5. 유저 생성 및 저장
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
        log.info("[회원가입] 유저 저장 완료: {}ms", System.currentTimeMillis() - start);

        // 6. 알림 설정 초기화
        userNotificationRepository.save(UserNotification.of(user));
        log.info("[회원가입] 알림 설정 저장 완료: {}ms", System.currentTimeMillis() - start);

        // 7. 마을 상태 초기화
        if (!villageStatusRepository.existsByDongCode(dong.getDongCode())) {
            villageStatusRepository.save(new VillageStatus(dong.getDongCode(), 1, 0, null));
            log.info("[회원가입] 마을 상태 초기화 저장 완료: {}ms", System.currentTimeMillis() - start);
        } else {
            log.info("[회원가입] 마을 상태 이미 존재: {}ms", System.currentTimeMillis() - start);
        }

        log.info("[회원가입] 전체 완료: {}ms", System.currentTimeMillis() - start);

        return new UserSignupResponse(user.getNo(), user.getNickname());
    }
}
