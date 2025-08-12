// src/components/pages/Home.jsx
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import instance from '../../apis/instance'

import logo from '../../assets/brandLogo.png'
import googleIcon from '../../assets/google.png'
import kakaoIcon from '../../assets/kakao.png'
import naverIcon from '../../assets/naver.png'
import appleIcon from '../../assets/apple.png'

export default function Home() {
  const navigate = useNavigate()
  const setAuthInfo = useAuthStore((s) => s.setAuthInfo)

  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  // ---- 환경설정/콜백 빌더 ----
  const CFG = useMemo(() => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
    const apiPrefix = (import.meta.env.VITE_API_PREFIX || '')
    const appBase = (import.meta.env.VITE_APP_BASE_URL || window.location.origin).replace(/\/+$/, '')
    const cbBase = import.meta.env.VITE_OAUTH_CALLBACK_PATH || '/oauth/callback' // base만, 예: /oauth/callback

    const buildRedirectUri = (provider) => `${appBase}${cbBase}/${provider}`

    return {
      API: `${apiBase}${apiPrefix}`,
      APP: appBase,
      buildRedirectUri,
      GOOGLE_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      KAKAO_ID: import.meta.env.VITE_KAKAO_CLIENT_ID,
      NAVER_ID: import.meta.env.VITE_NAVER_CLIENT_ID,
      APPLE_SERVICE_ID: import.meta.env.VITE_APPLE_SERVICE_ID, // (선택)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // 응답 스키마가 다를 때도 안전하게 뽑기
  const pickAuthPayload = (resp) => {
    const d = resp?.data ?? resp
    const p = d?.data ?? d
    return {
      userId: p?.userId ?? p?.id ?? p?.user_no ?? null,
      token: p?.token ?? p?.jwt ?? p?.accessToken ?? p?.access_token ?? null,
      nickname: p?.nickname ?? p?.name ?? p?.nick ?? '',
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const resp = await instance.post('/users/login', form)
      const { userId, token, nickname } = pickAuthPayload(resp)

      if (!token) {
        // 디버깅에 도움
        console.warn('[login resp raw]', resp)
        throw new Error('응답에서 토큰을 찾을 수 없습니다.')
      }

      setAuthInfo({ userId, nickname, email: form.email, token })

      // ❗ state에 axios 응답/에러 넣지 않음 (DataCloneError 방지)
      navigate('/quiz', { replace: true })
    } catch (err) {
      console.error('로그인 실패(detail):', err)
      const message =
        err?.response?.data?.message ||
        err?.message ||
        '알 수 없는 오류'
      alert('로그인 실패: ' + message)
    } finally {
      setSubmitting(false)
    }
  }

  // ---------- 소셜 authorize URL ----------
  const buildAuthorizeUrl = (provider) => {
    const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
    sessionStorage.setItem('oauth_state', state)
    sessionStorage.setItem('oauth_provider', provider)

    const redirect_uri = CFG.buildRedirectUri(provider)

    const ensure = (ok, msg) => {
      if (!ok) {
        alert(msg)
        throw new Error(msg)
      }
    }

    switch (provider) {
      case 'google': {
        ensure(!!CFG.GOOGLE_ID, 'VITE_GOOGLE_CLIENT_ID가 없습니다.')
        return `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
          client_id: CFG.GOOGLE_ID,
          redirect_uri,
          response_type: 'code',
          scope: 'openid email profile',
          state,
          include_granted_scopes: 'true',
          access_type: 'online',
          prompt: 'consent',
        }).toString()
      }
      case 'kakao': {
        ensure(!!CFG.KAKAO_ID, 'VITE_KAKAO_CLIENT_ID가 없습니다.')
        return `https://kauth.kakao.com/oauth/authorize?` + new URLSearchParams({
          client_id: CFG.KAKAO_ID,
          redirect_uri,
          response_type: 'code',
          state,
        }).toString()
      }
      case 'naver': {
        ensure(!!CFG.NAVER_ID, 'VITE_NAVER_CLIENT_ID가 없습니다.')
        return `https://nid.naver.com/oauth2.0/authorize?` + new URLSearchParams({
          client_id: CFG.NAVER_ID,
          redirect_uri,
          response_type: 'code',
          state,
        }).toString()
      }
      case 'apple': {
        // 실제 운영 시 nonce 등 추가 처리 권장
        ensure(!!CFG.APPLE_SERVICE_ID, 'VITE_APPLE_SERVICE_ID가 없습니다.')
        return `https://appleid.apple.com/auth/authorize?` + new URLSearchParams({
          client_id: CFG.APPLE_SERVICE_ID,
          redirect_uri,
          response_type: 'code',
          scope: 'name email',
          state,
        }).toString()
      }
      default:
        throw new Error('Unsupported provider')
    }
  }

  const startSocial = (provider) => {
    const url = buildAuthorizeUrl(provider)
    window.location.assign(url)
  }
  // ---------------------------------------

  const socialProviders = [
    { id: 'google', name: 'Google', icon: googleIcon, bg: 'bg-white', text: 'text-[#202020]' },
    { id: 'kakao', name: 'Kakao', icon: kakaoIcon, bg: 'bg-[#FEE500]', text: 'text-[#3C1E1E]' },
    { id: 'naver', name: 'Naver', icon: naverIcon, bg: 'bg-[#03C75A]', text: 'text-white' },
    { id: 'apple', name: 'Apple', icon: appleIcon, bg: 'bg-[#000000]', text: 'text-white' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#264D3D] font-ptd-400">
      <div className="bg-[#FEF7E2] w-full max-w-md p-10 rounded-2xl shadow-xl box-border">
        <div className="text-center">
          <img src={logo} alt="Loople Logo" className="h-14 mb-6 inline-block" />
        </div>

        <h2 className="text-xl sm:text-2xl font-ptd-700 text-b-ground text-center mb-1">
          나만의 루플 마을에 오신 걸 환영해요
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          로그인하고 루플링들과 함께 순환경제를 실천해요 🌱
        </p>

        {/* 로컬 로그인 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="username"
            disabled={submitting}
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border disabled:opacity-60"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            disabled={submitting}
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-primary text-white rounded-lg hover:bg-[#2f7b4d] transition font-ptd-600 border-none shadow-inner disabled:opacity-60"
          >
            {submitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-2 text-xs text-[#888] my-6">
          <div className="flex-1 h-px bg-[#DADADA]" /> 또는 <div className="flex-1 h-px bg-[#DADADA]" />
        </div>

        {/* 소셜 로그인 */}
        <div className="space-y-3">
          {socialProviders.map(({ id, name, icon, bg, text }) => (
            <button
              key={id}
              onClick={() => startSocial(id)}
              className={`w-full h-12 flex items-center border-none justify-center gap-3 rounded-lg ${bg} ${text} hover:opacity-90 transition font-ptd-500`}
            >
              <img src={icon} alt={name} className="w-5 h-5" />
              <span className="text-sm">{name}로 시작하기</span>
            </button>
          ))}
        </div>

        {/* 회원가입 안내 */}
        <p className="mt-8 text-sm text-center text-[#202020]">
          계정이 없으신가요?{' '}
          <span
            className="text-[#3C9A5F] font-semibold cursor-pointer hover:underline"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  )
}
