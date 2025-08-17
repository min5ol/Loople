// src/components/pages/Home.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, selectSetAuthInfo } from '../../store/authStore';
import instance from '../../apis/instance';

import logo from '../../assets/brandLogo.png';
import googleIcon from '../../assets/google.png';
import kakaoIcon from '../../assets/kakao.png';
import naverIcon from '../../assets/naver.png';
import appleIcon from '../../assets/apple.png';

export default function Home() {
  const navigate = useNavigate();
  const setAuthInfo = useAuthStore(selectSetAuthInfo);

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const CFG = useMemo(() => {
    const appBase = (import.meta.env.VITE_APP_BASE_URL || window.location.origin).replace(/\/+$/, '');
    return {
      APP: appBase,
      GOOGLE_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      KAKAO_ID: import.meta.env.VITE_KAKAO_CLIENT_ID,
      NAVER_ID: import.meta.env.VITE_NAVER_CLIENT_ID,
      REDIRECT: {
        google: import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${appBase}/oauth/callback/google`,
        kakao:  import.meta.env.VITE_KAKAO_REDIRECT_URI  || `${appBase}/oauth/callback/kakao`,
        naver:  import.meta.env.VITE_NAVER_REDIRECT_URI  || `${appBase}/oauth/callback/naver`,
        apple:  import.meta.env.VITE_APPLE_REDIRECT_URI  || `${appBase}/oauth/callback/apple`,
      },
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 핵심 수정: 응답 키를 표준화해서 store에 저장
  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        email: String(form.email || '').trim(),
        password: String(form.password || ''),
      };

      const res = await instance.post('/users/login', payload);
      const data = res?.data || {};

      // 다양한 백엔드 응답 키 이름 대응
      const accessToken =
        data.accessToken ?? data.token ?? data.jwt ?? data.access_token ?? null;
      const refreshToken =
        data.refreshToken ?? data.refresh_token ?? null;

      // 유저 정보 표준화
      const userId = data.userId ?? data.id ?? data.user?.id ?? null;
      const nickname =
        data.nickname ?? data.user?.nickname ?? data.user?.name ?? null;
      const email = data.email ?? data.user?.email ?? payload.email ?? null;

      if (!accessToken) {
        throw new Error('응답에서 accessToken(또는 token)이 없습니다.');
      }

      // 👉 스토어가 기대하는 형태로 저장
      setAuthInfo({
        accessToken,
        refreshToken,
        user: {
          id: userId,
          email,
          nickname,
          avatarUrl: data.user?.avatarUrl ?? data.user?.profileImageUrl ?? null,
        },
      });

      // 로그인 후 이동
      navigate('/quiz', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || '알 수 없는 오류가 발생했습니다.';
      alert('로그인 실패: ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  const buildAuthorizeUrl = (provider) => {
    const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_provider', provider);

    switch (provider) {
      case 'google':
        return `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
          client_id: CFG.GOOGLE_ID,
          redirect_uri: CFG.REDIRECT.google,
          response_type: 'code',
          scope: 'openid email profile',
          state,
          include_granted_scopes: 'true',
          access_type: 'online',
          prompt: 'consent',
        }).toString();
      case 'kakao':
        return `https://kauth.kakao.com/oauth/authorize?` + new URLSearchParams({
          client_id: CFG.KAKAO_ID,
          redirect_uri: CFG.REDIRECT.kakao,
          response_type: 'code',
          state,
        }).toString();
      case 'naver':
        return `https://nid.naver.com/oauth2.0/authorize?` + new URLSearchParams({
          client_id: CFG.NAVER_ID,
          redirect_uri: CFG.REDIRECT.naver,
          response_type: 'code',
          state,
        }).toString();
      case 'apple':
        return `https://appleid.apple.com/auth/authorize?` + new URLSearchParams({
          client_id: import.meta.env.VITE_APPLE_SERVICE_ID,
          redirect_uri: CFG.REDIRECT.apple,
          response_type: 'code',
          scope: 'name email',
          state,
        }).toString();
      default:
        throw new Error('Unsupported provider');
    }
  };

  const startSocial = (provider) => {
    const url = buildAuthorizeUrl(provider);
    window.location.assign(url);
  };

  const socialProviders = [
    { id: 'google', name: 'Google', icon: googleIcon, bg: 'bg-white', text: 'text-brand-ink' },
    { id: 'kakao',  name: 'Kakao',  icon: kakaoIcon,  bg: 'bg-[#FEE500]', text: 'text-[#3C1E1E]' },
    { id: 'naver',  name: 'Naver',  icon: naverIcon,  bg: 'bg-[#03C75A]', text: 'text-white' },
    { id: 'apple',  name: 'Apple',  icon: appleIcon,  bg: 'bg-black',     text: 'text-white' },
  ];

  const formInvalid = !form.email || !form.password;

  return (
    <div
      className="
        min-h-screen px-6 font-ptd-400 flex items-center justify-center
        bg-brand-50
        bg-[radial-gradient(900px_600px_at_10%_0%,#CFE7D8_0%,transparent_45%),radial-gradient(900px_600px_at_90%_100%,#FEF7E2_0%,transparent_40%)]
      "
    >
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: Branding */}
        <div className="order-2 md:order-1">
          <img src={logo} alt="Loople Logo" className="h-14 mb-6 drop-shadow" />
          <h1 className="text-3xl md:text-5xl font-ptd-700 text-brand-ink leading-tight mb-4">
            순환경제, 가볍게 시작해요
          </h1>
          <p className="text-base md:text-lg text-brand-ink/70 mb-8">
            루플링과 함께 출석하고 포인트를 쌓아 <br className="hidden md:block" />
            나만의 마을을 꾸며보세요.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="
              ctl-btn-primary rounded-full
              shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(60,154,95,0.35)]
              hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_14px_rgba(60,154,95,0.45)]
              transition-all
            "
          >
            지금 시작하기
          </button>
        </div>

        {/* Right: Login Card */}
        <div className="order-1 md:order-2">
          <div
            className="
              w-full max-w-md mx-auto rounded-2xl p-8
              bg-white/80 backdrop-blur-md
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_8px_20px_rgba(0,0,0,0.08)]
            "
          >
            <h2 className="text-2xl font-ptd-700 text-brand-ink text-center mb-6">로그인</h2>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                name="email"
                placeholder="이메일"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="username"
                className="
                  ctl-input
                  shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]
                  hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)]
                  transition-all
                "
              />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="
                  ctl-input
                  shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]
                  hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)]
                  transition-all
                "
              />
              <button
                type="submit"
                disabled={submitting || formInvalid}
                className="
                  ctl-btn-primary
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(60,154,95,0.4)]
                  hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_14px_rgba(60,154,95,0.5)]
                  transition-all
                "
              >
                {submitting ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div className="flex items-center gap-3 text-xs text-brand-ink/60 my-6">
              <div className="flex-1 h-px bg-brand-ink/15" />
              또는
              <div className="flex-1 h-px bg-brand-ink/15" />
            </div>

            <div className="space-y-3">
              {socialProviders.map(({ id, name, icon, bg, text }) => (
                <button
                  key={id}
                  onClick={() => startSocial(id)}
                  className={`
                    ctl-btn-social ${bg} ${text}
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_3px_6px_rgba(0,0,0,0.08)]
                    hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_8px_rgba(0,0,0,0.1)]
                    transition-all
                  `}
                >
                  <img src={icon} alt={name} className="w-5 h-5" />
                  <span className="text-sm">{name}로 시작하기</span>
                </button>
              ))}
            </div>

            <p className="mt-8 text-sm text-center text-brand-ink">
              계정이 없으신가요?{' '}
              <span
                onClick={() => navigate('/signup')}
                className="text-brand-600 font-semibold cursor-pointer hover:underline"
              >
                회원가입
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
