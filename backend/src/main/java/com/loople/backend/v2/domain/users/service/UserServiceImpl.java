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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService
{
    private final UserRepository userRepository;
    private final BeopjeongdongRepository beopjeongdongRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    private final MyAvatarService myAvatarService;
    private final MyBadgeService myBadgeService;
    private final MyRoomService myRoomService;
    private final MyLooplingService myLooplingService;
    private final MyVillageService myVillageService;

    private void validateDuplicate(String email, String nickname)
    {
        if(userRepository.existsByEmail(email)) throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        if(userRepository.existsByNickname(nickname)) throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);
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
    public UserLoginResponse login(UserLoginRequest request)
    {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if(!passwordEncoder.matches(request.password(), user.getPasswordHash()))
            throw new CustomException(ErrorCode.INVALID_PASSWORD);

        String token = jwtProvider.createToken(user.getNo(), user.getRole());

        return new UserLoginResponse(token);
    }

    @Override
    public EmailCheckResponse checkEmail(String email)
    {
        boolean available = !userRepository.existsByEmail(email);
        return new EmailCheckResponse(available);
    }

    @Override
    public NicknameCheckResponse checkNickname(String nickname)
    {
        boolean available = !userRepository.existsByNickname(nickname);
        return new NicknameCheckResponse(available);
    }

    @Override
    public UserLoginResponse socialLoginOrRedirect(OAuthUserInfo userInfo)
    {
        return userRepository.findByProviderAndSocialId(userInfo.getProvider(), userInfo.getSocialId())
                .map(user -> new UserLoginResponse(jwtProvider.createToken(user.getNo(), user.getRole())))
                .orElse(null);
    }

    @Override
    public void updatePoints(UpdatedUserPointRequest request)
    {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        user.addPoints(request.getPoints());
        userRepository.save(user);
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
            user.getVillage() == null)
        {
            throw new CustomException(ErrorCode.SIGNUP_NOT_COMPLETE);
        }

        User completedUser = User.builder()
                .no(user.getNo())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash())
                .name(user.getName())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .beopjeongdong(user.getBeopjeongdong())
                .address(user.getAddress())
                .detailAddress(user.getDetailAddress())
                .profileImageUrl(user.getProfileImageUrl())
                .provider(user.getProvider())
                .socialId(user.getSocialId())
                .myAvatar(user.getMyAvatar())
                .badge(user.getBadge())
                .room(user.getRoom())
                .myLoopling(user.getMyLoopling())
                .village(user.getVillage())
                .role(user.getRole())
                .signupStatus(SignupStatus.COMPLETED)
                .points(user.getPoints())
                .isDeleted(user.getIsDeleted())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

        userRepository.save(completedUser);
    }

    @Override
    public void assignDefaultAvatar(Long userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (user.getMyAvatar() != null)
        {
            throw new CustomException(ErrorCode.ALREADY_ASSIGNED_AVATAR);
        }

        MyAvatar avatar = myAvatarService.createDefaultAvatar(user);

        User updated = User.builder()
                .no(user.getNo())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash())
                .name(user.getName())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .beopjeongdong(user.getBeopjeongdong())
                .address(user.getAddress())
                .detailAddress(user.getDetailAddress())
                .profileImageUrl(user.getProfileImageUrl())
                .provider(user.getProvider())
                .socialId(user.getSocialId())
                .role(user.getRole())
                .signupStatus(user.getSignupStatus())
                .points(user.getPoints())
                .isDeleted(user.getIsDeleted())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .myAvatar(avatar)
                .build();

        userRepository.save(updated);
    }

    @Override
    public void assignDefaultBadge(Long userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (user.getBadge() != null)
        {
            throw new CustomException(ErrorCode.ALREADY_ASSIGNED_BADGE);
        }

        MyBadge badge = myBadgeService.assignDefaultBadge(user);

        User updated = User.builder()
                .no(user.getNo())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash())
                .name(user.getName())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .beopjeongdong(user.getBeopjeongdong())
                .address(user.getAddress())
                .detailAddress(user.getDetailAddress())
                .profileImageUrl(user.getProfileImageUrl())
                .provider(user.getProvider())
                .socialId(user.getSocialId())
                .points(user.getPoints())
                .isDeleted(user.getIsDeleted())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .myAvatar(user.getMyAvatar())
                .badge(badge)
                .build();

        userRepository.save(updated);
    }

    @Override
    public void assignDefaultRoom(Long userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if(user.getRoom() != null)
        {
            throw new CustomException(ErrorCode.ALREADY_ASSIGNED_ROOM);
        }

        MyRoom room = myRoomService.createDefaultRoom(user);

        User updated = User.builder()
                .no(user.getNo())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash())
                .name(user.getName())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .beopjeongdong(user.getBeopjeongdong())
                .address(user.getAddress())
                .detailAddress(user.getDetailAddress())
                .profileImageUrl(user.getProfileImageUrl())
                .provider(user.getProvider())
                .role(user.getRole())
                .signupStatus(user.getSignupStatus())
                .points(user.getPoints())
                .isDeleted(user.getIsDeleted())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .myAvatar(user.getMyAvatar())
                .badge(user.getBadge())
                .room(room)
                .build();

        userRepository.save(updated);
    }

    @Override
    public void assignLoopling(Long userId, Long catalogId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (user.getMyLoopling() != null)
        {
            throw new CustomException(ErrorCode.ALREADY_ASSIGNED_LOOPLING);
        }

        MyLoopling loopling = myLooplingService.assignLoopling(user, catalogId);

        User updated = User.builder()
                .no(user.getNo())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash())
                .name(user.getName())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .beopjeongdong(user.getBeopjeongdong())
                .address(user.getAddress())
                .detailAddress(user.getDetailAddress())
                .profileImageUrl(user.getProfileImageUrl())
                .provider(user.getProvider())
                .socialId(user.getSocialId())
                .role(user.getRole())
                .signupStatus(user.getSignupStatus())
                .points(user.getPoints())
                .isDeleted(user.getIsDeleted())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .myAvatar(user.getMyAvatar())
                .badge(user.getBadge())
                .room(user.getRoom())
                .myLoopling(loopling)
                .build();

        userRepository.save(updated);
    }

    @Override
    public void assignVillage(Long userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (user.getVillage() != null)
        {
            throw new CustomException(ErrorCode.ALREADY_ASSIGNED_VILLAGE);
        }

        String dongCodePrefix = user.getBeopjeongdong().getDongCode().substring(0, 8);

        MyVillage village = myVillageService.assignVillage(user, dongCodePrefix);

        User updated = User.builder()
                .no(user.getNo())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash())
                .name(user.getName())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .beopjeongdong(user.getBeopjeongdong())
                .address(user.getAddress())
                .detailAddress(user.getDetailAddress())
                .profileImageUrl(user.getProfileImageUrl())
                .provider(user.getProvider())
                .socialId(user.getSocialId())
                .role(user.getRole())
                .signupStatus(user.getSignupStatus())
                .points(user.getPoints())
                .isDeleted(user.getIsDeleted())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .myAvatar(user.getMyAvatar())
                .badge(user.getBadge())
                .room(user.getRoom())
                .myLoopling(user.getMyLoopling())
                .village(village)
                .build();

        userRepository.save(updated);
    }

    //현재 인증된 유저 정보 가져오기
    @Override
    public UserInfoResponse getMyInfo(UserDetails user) {
        System.out.println("user = " + user.getUsername());
        return null;
    }
}