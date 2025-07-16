import instance from "../apis/instance";

/**
 * 사용자 회원가입 요청
 * @param {Object} data 회원가입 전체 입력값
 * @returns {Promise<Object>} 회원가입 응답
 */
export const signup = async (data) => {
  try {
    const payload = {
      ...data,
      ri: data.ri ?? "",
      ruleType: data.ruleType ?? "ETC",
      residenceName: data.residenceName || "기타",
    };

    const response = await instance.post("/users/signup", payload);
    return response.data;
  } catch (err) {
    console.error("🚨 회원가입 실패:", err.response?.data || err.message);
    throw err;
  }
};
