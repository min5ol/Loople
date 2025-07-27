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
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import com.loople.backend.v2.global.exception.CustomException;
import com.loople.backend.v2.global.exception.ErrorCode;
import com.loople.backend.v2.global.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final MyVillageService myVillageService;
    private final MyRoomService myRoomService;
    private final MyBadgeService myBadgeService;
    private final MyLooplingService myLooplingService;
    private final MyAvatarService myAvatarService;

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

    private User createUser(
            String email,
            String passwordHash,
            String name,
            String nickname,
            String phone,
            Beopjeongdong beopjeongdong,
            String address,
            String detailAddress,
            String profileImageUrl,
            Provider provider,
            String socialId,
            String looplingType
    )
    {
        MyVillage village = myVillageService.assignVillage(beopjeongdong.getDongCode());
        MyRoom room = myRoomService.createDefaultRoom();
        MyBadge badge = myBadgeService.assignDefaultBadge();
        MyLoopling loopling = myLooplingService.create(looplingType);
        MyAvatar avatar = myAvatarService.createDefaultAvatar();

        return User.builder()
                .email(email)
                .passwordHash(passwordHash)
                .name(name)
                .nickname(nickname)
                .phone(phone)
                .beopjeongdong(beopjeongdong)
                .address(address)
                .detailAddress(detailAddress)
                .provider(provider)
                .socialId(socialId)
                .profileImageUrl(profileImageUrl)
                .village(village)
                .room(room)
                .badge(badge)
                .role(Role.USER)
                .build();
    }

    @Override
    public UserSignupResponse signup(UserSignupRequest request)
    {
        validateDuplicate(request.email(), request.nickname());

        Beopjeongdong region = findBeopjeongdong(request.sido(), request.sigungu(), request.eupmyun(), request.ri());

        User user = createUser(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.name(),
                request.nickname(),
                request.phone(),
                region,
                request.fullAddress(),
                request.detailAddress(),
                request.profileImageUrl(),
                Provider.LOCAL,
                null,
                request.looplingType()
        );

        userRepository.save(user);

        String token = jwtProvider.createToken(user.getNo(), user.getRole());

        return new UserSignupResponse(user.getNo(), user.getNickname(), token);
    }

    @Override
    public SocialSignupResponse socialSignup(SocialSignupRequest request)
    {
        validateDuplicate(request.email(), request.nickname());

        Beopjeongdong region = findBeopjeongdong(request.sido(), request.sigungu(), request.eupmyun(), request.ri());

        User user = createUser(
                request.email(),
                null,
                request.name(),
                request.nickname(),
                request.phone(),
                region,
                request.fullAddress(),
                request.detailAddress(),
                request.profileImageUrl(),
                Provider.valueOf(request.provider()),
                request.socialId(),
                request.looplingType()
        );

        userRepository.save(user);

        String token = jwtProvider.createToken(user.getNo(), user.getRole());

        return new SocialSignupResponse(user.getNo(), user.getNickname(), token);
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
        return new EmailCheckResponse(!userRepository.existsByEmail(email));
    }

    @Override
    public NicknameCheckResponse checkNickname(String nickname)
    {
        return new NicknameCheckResponse(!userRepository.existsByNickname(nickname));
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
}