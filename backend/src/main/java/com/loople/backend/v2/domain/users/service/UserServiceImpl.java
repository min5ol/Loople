/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자 서비스 구현체 (리팩토링)
 *       - 세터/엔티티 재생성 제거 → 도메인 메서드 + JPA 더티체킹
 *       - 포인트 누적 버그 수정
 *       - 트랜잭션 정리
 */

package com.loople.backend.v2.domain.users.service;

import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import com.loople.backend.v2.domain.beopjeongdong.repository.BeopjeongdongRepository;
import com.loople.backend.v2.domain.myAvatar.entity.MyAvatar;
import com.loople.backend.v2.domain.myAvatar.service.MyAvatarService;
import com.loople.backend.v2.domain.myBadge.entity.MyBadge;
import com.loople.backend.v2.domain.myBadge.service.MyBadgeService;
import com.loople.backend.v2.domain.myLoopling.entity.MyLoopling;
import com.loople.backend.v2.domain.myLoopling.service.MyLooplingService;
import com.loople.backend.v2.domain.myRoom.entity.MyRoom;
import com.loople.backend.v2.domain.myRoom.service.MyRoomService;
import com.loople.backend.v2.domain.myVillage.entity.MyVillage;
import com.loople.backend.v2.domain.myVillage.service.MyVillageService;
import com.loople.backend.v2.domain.quiz.dto.AttendanceInfoResponse;
import com.loople.backend.v2.domain.quiz.service.QuizService;
import com.loople.backend.v2.domain.users.dto.*;
import com.loople.backend.v2.domain.users.entity.Provider;
import com.loople.backend.v2.domain.users.entity.Role;
import com.loople.backend.v2.domain.users.entity.SignupStatus;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import com.loople.backend.v2.global.exception.CustomException;
import com.loople.backend.v2.global.exception.ErrorCode;
import com.loople.backend.v2.global.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional // 기본 트랜잭션: 쓰기 가능. 조회 전용 메서드는 개별로 readOnly 적용
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BeopjeongdongRepository beopjeongdongRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    private final MyAvatarService myAvatarService;
    private final MyBadgeService myBadgeService;
    private final MyRoomService myRoomService;
    private final MyLooplingService myLooplingService;
    private final MyVillageService myVillageService;

    private final QuizService quizService;

    private void validateDuplicate(String email, String nickname)
    {
        if (userRepository.existsByEmail(email)) throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        if (userRepository.existsByNickname(nickname)) throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);
    }

    private Beopjeongdong findBeopjeongdong(String sido, String sigungu, String eupmyun, String ri)
    {
        return beopjeongdongRepository.findBySidoAndSigunguAndEupmyunAndRi(sido, sigungu, eupmyun, ri)
                .orElseThrow(() -> new CustomException(ErrorCode.ADDRESS_NOT_FOUND));
    }

    @Override
    public UserSignupResponse signup(UserSignupRequest request)
    {
        validateDuplicate(request.email(), request.nickname());

        Beopjeongdong region = findBeopjeongdong(request.sido(), request.sigungu(), request.eupmyun(), request.ri());

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .name(request.name())
                .nickname(request.nickname())
                .phone(request.phone())
                .beopjeongdong(region)
                .address(request.fullAddress())
                .detailAddress(request.detailAddress())
                .profileImageUrl(request.profileImageUrl())
                .provider(Provider.LOCAL)
                .signupStatus(SignupStatus.PENDING)
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtProvider.createToken(user.getNo(), user.getRole());
        return new UserSignupResponse(user.getNo(), user.getNickname(), token, user.getSignupStatus());
    }

    @Override
    public SocialSignupResponse socialSignup(SocialSignupRequest request)
    {
        validateDuplicate(request.email(), request.nickname());

        Beopjeongdong region = findBeopjeongdong(request.sido(), request.sigungu(), request.eupmyun(), request.ri());

        User user = User.builder()
                .email(request.email())
                .passwordHash(null)
                .name(request.name())
                .nickname(request.nickname())
                .phone(request.phone())
                .beopjeongdong(region)
                .address(request.fullAddress())
                .detailAddress(request.detailAddress())
                .profileImageUrl(request.profileImageUrl())
                .provider(Provider.valueOf(request.provider()))
                .socialId(request.socialId())
                .signupStatus(SignupStatus.PENDING)
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtProvider.createToken(user.getNo(), user.getRole());
        return new SocialSignupResponse(user.getNo(), user.getNickname(), token, user.getSignupStatus());
    }

    @Override
    @Transactional(readOnly = true)
    public UserLoginResponse login(UserLoginRequest request)
    {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash()))
            throw new CustomException(ErrorCode.INVALID_PASSWORD);

        String token = jwtProvider.createToken(user.getNo(), user.getRole());
        return new UserLoginResponse(user.getNo(), token, user.getNickname());
    }

    @Override
    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email)
    {
        boolean available = !userRepository.existsByEmail(email);
        return new EmailCheckResponse(available);
    }

    @Override
    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname)
    {
        boolean available = !userRepository.existsByNickname(nickname);
        return new NicknameCheckResponse(available);
    }

    @Override
    @Transactional(readOnly = true)
    public UserLoginResponse socialLoginOrRedirect(OAuthUserInfo userInfo)
    {
        User user = userRepository.findByProviderAndSocialId(userInfo.getProvider(), userInfo.getSocialId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String token = jwtProvider.createToken(user.getNo(), user.getRole());
        return new UserLoginResponse(user.getNo(), token, user.getNickname());
    }

    @Override
    public void updatePoints(Long userId, UpdatedUserPointRequest request)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 누적 delta만 적용 (음수 방지는 도메인 메서드에서 처리)
        user.addPoints(request.points());
    }

    @Override
    public void completeSignup(Long userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (user.getMyAvatar() == null ||
                user.getBadge() == null ||
                user.getRoom() == null ||
                user.getMyLoopling() == null ||
                user.getVillage() == null) {
            throw new CustomException(ErrorCode.SIGNUP_NOT_COMPLETE);
        }

        // 엔티티 재생성/저장 없이 상태만 변경 → 더티체킹
        user.markSignupCompleted();
    }

    @Override
    public void assignDefaultAvatar(Long userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (user.getMyAvatar() != null) throw new CustomException(ErrorCode.ALREADY_ASSIGNED_AVATAR);

        MyAvatar avatar = myAvatarService.createDefaultAvatar(user);
        user.assignAvatar(avatar);
    }

    @Override
    public void assignDefaultBadge(Long userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (user.getBadge() != null) throw new CustomException(ErrorCode.ALREADY_ASSIGNED_BADGE);

        MyBadge badge = myBadgeService.assignDefaultBadge(user);
        user.assignBadge(badge);
    }

    @Override
    public void assignDefaultRoom(Long userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (user.getRoom() != null) throw new CustomException(ErrorCode.ALREADY_ASSIGNED_ROOM);

        MyRoom room = myRoomService.createDefaultRoom(user);
        user.assignRoom(room);
    }

    @Override
    public void assignLoopling(Long userId, Long catalogId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (user.getMyLoopling() != null) throw new CustomException(ErrorCode.ALREADY_ASSIGNED_LOOPLING);

        MyLoopling loopling = myLooplingService.assignLoopling(user, catalogId);
        user.assignLoopling(loopling);
    }

    @Override
    public void assignVillage(Long userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (user.getVillage() != null) throw new CustomException(ErrorCode.ALREADY_ASSIGNED_VILLAGE);

        String dongCodePrefix = user.getBeopjeongdong().getDongCode().substring(0, 8);
        MyVillage village = myVillageService.assignVillage(user, dongCodePrefix);
        user.assignVillage(village);
    }

    @Override
    @Transactional(readOnly = true)
    public UserInfoResponse getUserInfo(Long userId)
    {
        User user = userRepository.findByNo(userId)
                .orElseThrow(() -> new NoSuchElementException("해당 사용자가 존재하지 않습니다."));
        return new UserInfoResponse(user.getNo(), user.getNickname(), user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public MyPageResponse getMyPage(Long userId)
    {
        User user = userRepository.findByNo(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<Integer> attendanceDays = quizService.fetchAttendanceStatus(userId);

        return new MyPageResponse(
                user.getProfileImageUrl(),
                user.getEmail(),
                user.getPhone(),
                user.getNickname(),
                user.getPoints(),
                attendanceDays
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceInfoResponse getAttendanceInfo(Long userId)
    {
        return quizService.getAttendanceInfo(userId);
    }

    @Override
    public String updateProfileImage(org.springframework.security.core.userdetails.User user, UpdateProfileImageRequest request) {
        return "";
    }

    @Override
    public String updateNickname(org.springframework.security.core.userdetails.User user, UpdateNicknameRequest request) {
        return "";
    }

    @Override
    public String updatePhone(org.springframework.security.core.userdetails.User user, UpdatePhoneReqeust reqeust) {
        return "";
    }
}
