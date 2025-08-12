// src/components/pages/OAuthCallback.jsx
// 작성일: 2025.07.21
// 수정일: 2025.08.12
// 설명: /oauth/callback/:provider (기존 유저는 /quiz로 이동, 신규는 /signup/step2)

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { socialLogin } from "../../apis/oauth";
import { useSignupStore } from "../../store/signupStore";
import { useAuthStore, selectSetAuthInfo } from "../../store/authStore";
import instance from "../../apis/instance"; // (선택) 프로필 프리페치용

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { provider: providerFromPath } = useParams(); // google|kakao|naver|apple
  const navigate = useNavigate();

  const { setSocialData } = useSignupStore();
  const setAuthInfo = useAuthStore(selectSetAuthInfo);

  const [statusMessage, setStatusMessage] = useState("소셜 로그인 중입니다...");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const provider = (providerFromPath || "").toLowerCase();

    const savedState = sessionStorage.getItem("oauth_state");
    const savedProvider = (sessionStorage.getItem("oauth_provider") || "").toLowerCase();

    // 1) 기본 파라미터 검증
    if (!code || !state || !provider) {
      setStatusMessage("잘못된 접근입니다. (code/state/provider 누락)");
      const t = setTimeout(() => navigate("/", { replace: true }), 800);
      return () => clearTimeout(t);
    }

    // 2) state/provider 검증
    if (state !== savedState || provider !== savedProvider) {
      setStatusMessage("보안 검증 실패 (state/provider 불일치)");
      const t = setTimeout(() => navigate("/", { replace: true }), 800);
      return () => clearTimeout(t);
    }

    let timeoutId;

    (async () => {
      try {
        setStatusMessage("소셜 인증 처리 중...");

        // 3) 백엔드 인증 교환
        // 예상 응답: { token: string|null, isNew: boolean, email, socialId, provider, userId?, nickname? }
        const res = await socialLogin(provider, code);
        console.log("[OAuth] 백엔드 응답:", res);

        const token = res?.token ?? res?.accessToken ?? null;
        const isNew = typeof res?.isNew === "boolean" ? res.isNew : !token;
        const normalizedProvider = (res?.provider || provider).toUpperCase();

        if (!isNew && token) {
          // 4-A) 기존 유저: 토큰 저장 → (선택)프로필 프리페치 → /quiz
          setAuthInfo({
            accessToken: token, // ✅ 반드시 accessToken 키로 저장 (interceptor가 이 키를 읽음)
            user: {
              id: res?.userId ?? res?.socialId ?? null,
              email: res?.email ?? null,
              nickName: res?.nickname ?? null, // store에서 nickname으로 매핑됨
              provider: normalizedProvider,
            },
          });

          // (선택) 닉네임 등 바로 필요한 경우 프리페치
          try {
            // 백엔드에 맞는 내 정보 API로 교체하세요. 예: /users/userInfo 또는 /users/me
            const me = await instance.get("/users/userInfo");
            const user = me?.data;
            if (user) {
              // user 전체를 넘기면 store 매핑에서 nickname 등 반영됨
              setAuthInfo({ user });
            }
          } catch {
            // 프로필 API 실패해도 로그인은 진행
          }

          setStatusMessage("기존 유저입니다. 로그인 중...");
          timeoutId = setTimeout(() => navigate("/quiz", { replace: true }), 300);
          return;
        }

        // 4-B) 신규 유저: 가입 단계로
        setSocialData({
          provider: normalizedProvider,
          email: res?.email || "",
          socialId: res?.socialId || "",
        });
        // step2에서 필요하면 꺼내쓰도록 세션에도 저장
        sessionStorage.setItem("provider", normalizedProvider);
        sessionStorage.setItem("socialId", res?.socialId || "");
        sessionStorage.setItem("email", res?.email || "");

        setStatusMessage("신규 유저입니다. 가입창으로 이동합니다...");
        timeoutId = setTimeout(() => navigate("/signup/step2", { replace: true }), 400);
      } catch (e) {
        console.error("[OAuth] 실패:", e);
        setStatusMessage("오류가 발생했습니다. 메인으로 이동합니다.");
        timeoutId = setTimeout(() => navigate("/", { replace: true }), 800);
      } finally {
        // 5) state/provider 정리
        sessionStorage.removeItem("oauth_state");
        sessionStorage.removeItem("oauth_provider");
      }
    })();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchParams, providerFromPath, navigate, setSocialData, setAuthInfo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF7E2]">
      <div className="p-6 bg-white rounded-xl shadow text-xl font-semibold">
        {statusMessage}
      </div>
    </div>
  );
}
