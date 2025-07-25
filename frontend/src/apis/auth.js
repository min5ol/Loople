// 작성일: 2025.07.18
// 작성자: 장민솔
// 설명: 이메일과 비밀번호를 이용해 로그인 요청 보낸 후 응답 데이터 반환

// src/apis/auth.js
import axiosInstance from './instance'; // axios 설정 파일 임포트

export const login = async ({ email, password }) => {
  // 이메일, 비밀번호 서버에 POST 요청
  // 요청주소는 /users/Login body에 email, password 같이 보냄
  const res = await axiosInstance.post('/users/login', { email, password });

  // 서버에서 응답 받은 데이터만 꺼내서 그대로 반환
  // 로그인 성공 시 토큰이나 유저 정보가 여기 들어감
  return res.data;
};