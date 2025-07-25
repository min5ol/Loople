// src/components/pages/OAuthCallback.jsx

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { socialLogin } from "../../apis/oauth";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [statusMessage, setStatusMessage] = useState("소셜 로그인 중입니다...");

  useEffect(() => {
    const code = searchParams.get("code");
    const provider = pathname.split("/").pop()?.toUpperCase();

    if (!code || !provider) return;

    (async () => {
      try {
        setStatusMessage("소셜 인증 처리 중...");

        const res = await socialLogin(provider, code);

        if (res.isRegistered) {
          setStatusMessage("기존 유저입니다. 로그인 중입니다...");
          localStorage.setItem("accessToken", res.accessToken);
          setTimeout(() => navigate("/onboarding"), 800);
        } else {
          setStatusMessage("신규 유저입니다. 가입창으로 이동합니다...");
          sessionStorage.setItem("provider", res.provider);
          sessionStorage.setItem("socialId", res.socialId);
          sessionStorage.setItem("email", res.email);
          setTimeout(() => navigate("/signup/step2"), 1200);
        }
      } catch (err) {
        console.error("소셜 로그인 실패:", err);
        setStatusMessage("오류가 발생했습니다. 메인으로 이동합니다.");
        setTimeout(() => navigate("/"), 1500);
      }
    })();
  }, [searchParams, pathname, navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-xl font-semibold">
      {statusMessage}
    </div>
  );
};

export default OAuthCallback;