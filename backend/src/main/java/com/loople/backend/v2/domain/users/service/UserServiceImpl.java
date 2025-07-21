/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자 서비스 구현체
 *       - 회원가입: 중복 검사, 주소 매핑, 유저/알림/마을 초기화 처리
 *       - 로그인: 이메일 + 비밀번호 검증 및 토큰 발급
 */

package com.loople.backend.v2.domain.users.service;

import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import com.loople.backend.v2.domain.beopjeongdong.service.BeopjeongdongService;
import com.loople.backend.v2.domain.userNotification.entity.UserNotification;
import com.loople.backend.v2.domain.userNotification.repository.UserNotificationRepository;
import com.loople.backend.v2.domain.users.dto.UserLoginRequest;
import com.loople.backend.v2.domain.users.dto.UserLoginResponse;
import com.loople.backend.v2.domain.users.dto.UserSignupRequest;
import com.loople.backend.v2.domain.users.dto.UserSignupResponse;
import com.loople.backend.v2.domain.users.entity.Provider;
import com.loople.backend.v2.domain.users.entity.Role;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import com.loople.backend.v2.domain.villageStatus.entity.VillageStatus;
import com.loople.backend.v2.domain.villageStatus.repository.VillageStatusRepository;
import com.loople.backend.v2.global.jwt.JwtProvider;
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
    private final JwtProvider jwtProvider;

    /**
     * 회원가입 처리
     * - 이메일 중복 검사
     * - 동코드 매핑 및 법정동 조회
     * - 유저, 알림, 마을상태 엔티티 저장
     */
    @Override
    @Transactional
    public UserSignupResponse signup(UserSignupRequest request) {
        long start = System.currentTimeMillis();
        log.info("[회원가입] 시작: 이메일={}, 닉네임={}", request.email(), request.nickname());

        // 1. 이메일 중복 확인
        if (userRepository.findByEmail(request.email()).isPresent()) {
            log.warn("[회원가입] 이메일 중복: {}", request.email());
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        // 2. 동코드 조회
        String dongCode = beopjeongdongService.getDongCode(
                request.sido(), request.sigungu(), request.eupmyun(), request.ri());
        log.info("[회원가입] 동코드 조회 완료: {}", dongCode);

        // 3. 법정동 정보 조회
        Beopjeongdong dong = beopjeongdongService.findByDongCode(dongCode)
                .orElseThrow(() -> {
                    log.warn("[회원가입] dongCode={} 에 해당하는 법정동 없음", dongCode);
                    return new IllegalArgumentException("법정동 정보를 찾을 수 없습니다.");
                });

        // 4. 주소 조합 (시도 시군구 읍면동 [리])
        String fullAddress = String.join(" ",
                request.sido(), request.sigungu(), request.eupmyun(),
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
        log.info("[회원가입] 유저 저장 완료: userId={}, nickname={}", user.getNo(), user.getNickname());

        // 6. 알림 설정 초기화
        userNotificationRepository.save(UserNotification.of(user));
        log.info("[회원가입] 알림 설정 초기화 완료");

        // 7. 마을 상태 초기화 (없을 때만)
        if (!villageStatusRepository.existsByDongCode(dong.getDongCode())) {
            villageStatusRepository.save(new VillageStatus(dong.getDongCode(), 1, 0, null));
            log.info("[회원가입] 마을 상태 신규 생성: dongCode={}", dong.getDongCode());
        } else {
            log.info("[회원가입] 마을 상태 이미 존재: dongCode={}", dong.getDongCode());
        }

        // 8. 토큰 발급
        String token = jwtProvider.createToken(user.getNo(), user.getRole());

        log.info("[회원가입] 전체 완료: {}ms 소요", System.currentTimeMillis() - start);
        return new UserSignupResponse(user.getNo(), user.getNickname(), token);
    }

    /**
     * 로그인 처리
     * - 이메일 존재 여부 확인
     * - 비밀번호 검증
     * - JWT 토큰 생성 및 반환
     */
    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        log.info("[로그인] 요청 email={}", request.email());

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    log.warn("[로그인] 이메일 없음: {}", request.email());
                    return new IllegalArgumentException("존재하지 않는 이메일입니다.");
                });

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            log.warn("[로그인] 비밀번호 불일치: email={}", request.email());
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtProvider.createToken(user.getNo(), user.getRole());
        log.info("[로그인] 성공: userId={}, role={}, token 생성 완료", user.getNo(), user.getRole());

        return new UserLoginResponse(token);
    }

    @Override
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    @Override
    public boolean isNicknameAvailable(String nickname) {
        return !userRepository.existsByNickname(nickname);
    }

    private User registerSocialUser(OAuthUserInfo userInfo) {
        User user = User.builder()
                .email(userInfo.getEmail())
                .nickname(userInfo.getNickname())
                .profileImageUrl(userInfo.getProfileImageUrl())
                .provider(userInfo.getProvider())
                .socialId(userInfo.getSocialId())
                .address(null) // 주소는 온보딩에서 등록
                .detailAddress(null)
                .beopjeongdong(null) // 필수지만 이후에 등록
                .name(null)          // 이름도 이후에 설정 가능
                .phone(null)
                .build();

        return userRepository.save(user);
    }

    @Override
    public User findOrRegister(OAuthUserInfo userInfo) {
        return userRepository.findByProviderAndSocialId(userInfo.getProvider(),userInfo.getSocialId())
                .orElseGet(() -> registerSocialUser(userInfo));
    }

    @Override
    public boolean isNewUser(User user) {
        return user.getBeopjeongdong() == null;
    }
}