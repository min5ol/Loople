// 작성일: 2025.07.21
// 작성자: 장민솔
// 설명: 소셜 로그인 요청 API - provider와 code를 백엔드에 전송하여 JWT 토큰을 발급받음

import axiosInstance from './instance';

/**
 * 소셜 로그인 요청
 * @param {string} provider - "kakao" | "google" | "naver"
 * @param {*} code - OAuth 인가 코드
 * @returns {Promise<{ accessToken: string, isNewUser: boolean}>}
 */

export const socialLogin = async (provider, code) => {
  const res = await axiosInstance.post('/oauth/login', {
    provider,
    code,
  });
  return res.data;
};