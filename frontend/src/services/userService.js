// src/services/userService.js

import instance from "../apis/instance";

/**
 * 사용자 회원가입 요청
 * @param {Object} data 회원가입 전체 입력값
 * @returns {Promise<Object>} 회원가입 응답
 */
export const signup = async (data) => {
  try {
    // [수정] SignUpStep3에서 이미 payload가 잘 만들어졌으므로,
    // 추가적인 가공 없이 그대로 서버에 전송합니다.
    // 'ri: data.ri ?? ""' 로직을 제거했습니다.
    const response = await instance.post("/users/signup", data);
    return response.data;
  } catch (err) {
    console.error("회원가입 실패:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * 소셜 사용자 회원가입 요청
 * @param {Object} data 소셜 회원가입 전체 입력값
 * @returns {Promise<Object>} 회원가입 응답
 */
export const signupSocial = async (data) => {
  try {
    const response = await instance.post("/users/social-signup", data);
    return response.data;
  } catch (err) {
    console.error("소셜 회원가입 실패:", err.response?.data || err.message);
    throw err;
  }
};
