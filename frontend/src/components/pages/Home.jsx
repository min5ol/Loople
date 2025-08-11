// src/components/pages/Home.jsx

import React from 'react'
import { useState } from 'react'
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
  const setAuthInfo = useAuthStore((state) => state.setAuthInfo)

  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await instance.post('/users/login', form)

      // --- 디버깅을 위한 콘솔 로그 ---
      console.log('API 응답 전체:', res)
      console.log('API 응답 데이터:', res.data)
      // --------------------------

      // [핵심 수정] API 응답 데이터 구조에 맞게 수정합니다.
      // 만약 데이터가 res.data 안에 바로 있다면, 아래 코드가 맞습니다.
      const { userId, token, nickname } = res.data

      // 만약 데이터가 res.data.data 와 같은 다른 객체 안에 있다면,
      // const { userId, token, nickname } = res.data.data; 와 같이 수정해야 합니다.

      if (!token) {
        throw new Error('응답에서 토큰을 찾을 수 없습니다.')
      }

      setAuthInfo({
        userId,
        nickname,
        email: form.email,
        token,
      })

      navigate('/quiz', {state: {res}});
    } catch (err) {
      console.error('로그인 실패:', err) // 에러 객체 전체를 출력하여 상세 원인 파악
      alert(
        '로그인 실패: ' +
          (err.response?.data?.message ||
            '알 수 없는 오류가 발생했습니다.'),
      )
    }
  }

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
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
          />
          <button
            type="submit"
            className="w-full h-12 bg-primary text-white rounded-lg hover:bg-[#2f7b4d] transition font-ptd-600 border-none shadow-inner"
          >
            로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-2 text-xs text-[#888] my-6">
          <div className="flex-1 h-px bg-[#DADADA]" />
          또는
          <div className="flex-1 h-px bg-[#DADADA]" />
        </div>

        {/* 소셜 로그인 */}
        <div className="space-y-3">
          {socialProviders.map(({ id, name, icon, bg, text }) => (
            <button
              key={id}
              onClick={() =>
                (window.location.href = `${
                  import.meta.env.VITE_API_BASE_URL
                }/oauth2/authorization/${id}`)
              }
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