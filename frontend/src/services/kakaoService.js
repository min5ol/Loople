// 작성일: 2025.07.16
// 작성자: 장민솔
// 설명: 카카오 주소 검색 API를 활용하여 사용자가 입력한 주소 문자열을 위도/경도로 변환합니다.

import axios from 'axios';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY; // .env에서 API 키 불러오기

/**
 * 카카오 주소 검색 API 요청
 * @param {string} address - 사용자가 입력한 주소 문자열
 * @returns {Promise<Object>} - Kakao 주소 검색 결과 객체 (documents 배열 포함)
 */
export const searchKakaoAddress = async (address) => {
  try {
    const res = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
      params: { query: address },
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`, // 카카오 REST API 인증 방식
      },
    });

    return res.data;
  } catch (err) {
    console.error("카카오 주소 검색 실패:", err.response?.data || err.message);
    throw err; // 상위에서 처리하도록 예외 다시 던짐
  }
};