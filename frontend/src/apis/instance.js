// 작성일: 2025.07.14
// 작성자: 백진선, 장민솔
// 설명: 공통 axios 인스턴스 설정, 기본 주소랑 헤더 미리 지정

import axios from 'axios';

// 로컬 스토리지에서 accessToken 꺼내옴
// 로그인 후에 저장된 토큰이 있어야 Authorization 헤더에 붙여서 요청 가능함
const token = localStorage.getItem('accessToken');

// axios 인스턴스 하나 만들어서 설정
// baseURL은 백엔드 API 기본주소, 헤더에는 json 형식이랑 토큰 넣어둠
const instance = axios.create({
  baseURL: 'http://localhost:8080/api/v2',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});


export default instance;