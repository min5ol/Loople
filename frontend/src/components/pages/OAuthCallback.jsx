// pages/OAuthCallback.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socialLogin } from "../../apis/oauth";

export default function OAuthCallback()
{
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    const provider = sessionStorage.getItem("provider");

    if(!code || !provider) return;

    (async () => {
      try{
        const { accessToken, isNewUser } = await socialLogin(provider, code);
        localStorage.setItem("accessToken", accessToken);

        if(isNewUser) navigate("/signup/step3");
        else navigate("/onboarding");
      } catch(e) {
        alert("로그인 실패! 다시 시도해주세요.");
        navigate("/");
      }
    })();
  }, [navigate]);

  return <p>로그인 처리 중입니다...</p>;
}