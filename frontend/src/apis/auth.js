// src/apis/oauth.js
// 작성일: 2025.07.21
// 수정일: 2025.08.12
// 설명: 소셜 로그인 요청 API - provider/ code를 백엔드에 전송하여 JWT 토큰 발급 여부 확인
// 백엔드 스펙: POST /api/v2/oauth/login  { provider: 'KAKAO'|'GOOGLE'|'NAVER'|'APPLE', code: string }

import axiosInstance from './instance'

/**
 * 소셜 로그인 요청
 * @param {'kakao'|'google'|'naver'|'apple'} provider
 * @param {string} code
 * @returns {Promise<any>}  // { token|null, signupRequired:boolean, email, socialId, provider }
 */
export const socialLogin = async (provider, code) => {
  const payload = {
    provider: (provider || '').toUpperCase(), // 백엔드 ENUM 호환
    code,
  }
  const res = await axiosInstance.post('/oauth/login', payload)
  return res.data
}

export default { socialLogin }
