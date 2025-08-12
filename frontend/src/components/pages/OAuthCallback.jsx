// src/components/pages/OAuthCallback.jsx
// 작성일: 2025.07.21
// 수정일: 2025.08.12
// 설명: /oauth/callback/:provider
//   1) 쿼리에서 code/state 수신
//   2) Home에서 저장한 state/provider와 검증 (CSRF 방어)
//   3) 백엔드 /oauth/login 호출 → 신규면 socialData 저장 후 /signup/step2, 기존이면 token 저장 후 /onboarding

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { socialLogin } from "../../apis/oauth";
import { useSignupStore } from "../../store/signupStore";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { provider: providerFromPath } = useParams(); // google|kakao|naver|apple
  const navigate = useNavigate();
  const { setSocialData } = useSignupStore();

  const [statusMessage, setStatusMessage] = useState("소셜 로그인 중입니다...");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const provider = (providerFromPath || "").toLowerCase();

    // Home.jsx에서 저장했던 값
    const savedState = sessionStorage.getItem("oauth_state");
    const savedProvider = (sessionStorage.getItem("oauth_provider") || "").toLowerCase();

    // --- 기본 가드 ---
    if (!code || !state || !provider) {
      setStatusMessage("잘못된 접근입니다. (code/state/provider 누락)");
      const t = setTimeout(() => navigate("/", { replace: true }), 1000);
      return () => clearTimeout(t);
    }
    if (state !== savedState || provider !== savedProvider) {
      setStatusMessage("보안 검증 실패 (state/provider 불일치)");
      const t = setTimeout(() => navigate("/", { replace: true }), 1000);
      return () => clearTimeout(t);
    }

    (async () => {
      try {
        setStatusMessage("소셜 인증 처리 중...");

        const res = await socialLogin(provider, code);
        console.log("[OAuth] 백엔드 응답:", res);

        // --- 응답 키 방어적 처리 ---
        const signupRequired =
          typeof res?.signupRequired === "boolean"
            ? res.signupRequired
            // isRegistered가 false면 신규(true), true면 기존(false)로 역매핑
            : (res?.isRegistered === false ? true
               : (res?.isRegistered === true ? false
                  : !res?.isRegistered));

        if (signupRequired) {
          // 신규 유저 → Zustand + 세션 폴백 저장
          setSocialData({ provider: res.provider, email: res.email, socialId: res.socialId });
          sessionStorage.setItem("provider", res.provider || provider.toUpperCase());
          sessionStorage.setItem("socialId", res.socialId || "");
          sessionStorage.setItem("email", res.email || "");

          setStatusMessage("신규 유저입니다. 가입창으로 이동합니다...");
          setTimeout(() => navigate("/signup/step2", { replace: true }), 600);
          return;
        }

        // 기존 유저 → 토큰 저장
        const token =
          res?.token ??
          res?.accessToken ??
          res?.jwt ??
          res?.jwtToken ??
          res?.authorization ??
          null;

        if (!token) {
          console.error("[OAuth] 토큰 없음 - 응답:", res);
          throw new Error("토큰이 없습니다.");
        }

        localStorage.setItem("token", token); // 전역 정책에 맞게 키명 수정 가능
        setStatusMessage("기존 유저입니다. 로그인 중...");
        setTimeout(() => navigate("/onboarding", { replace: true }), 500);
      } catch (e) {
        console.error("[OAuth] 실패:", e);
        setStatusMessage("오류가 발생했습니다. 메인으로 이동합니다.");
        setTimeout(() => navigate("/", { replace: true }), 1000);
      } finally {
        // 민감/임시값 정리
        sessionStorage.removeItem("oauth_state");
        sessionStorage.removeItem("oauth_provider");
      }
    })();
  }, [searchParams, providerFromPath, navigate, setSocialData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF7E2]">
      <div className="p-6 bg-white rounded-xl shadow text-xl font-semibold">
        {statusMessage}
      </div>
    </div>
  );
}
