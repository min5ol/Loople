import axios from 'axios';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

/**
 * 카카오 주소 검색 API
 * @param {string} address
 * @returns {Promise<Object>} Kakao 주소 검색 결과
 */
export const searchKakaoAddress = async (address) => {
  try {
    const res = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
      params: { query: address },
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("카카오 주소 검색 실패", err.response?.data || err.message);
    throw err;
  }
};