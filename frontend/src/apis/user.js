import axiosInstance from "./instance";

// 이메일 중복 확인 API
export const checkEmail = async (email) => {
  const res = await axiosInstance.get(`/users/check-email?email=${email}`);
  return res.data;
};

// 닉네임 중복 확인 API
export const checkNickname = async (nickname) => {
  const res = await axiosInstance.get(`/users/check-nickname?nickname=${nickname}`);
  return res.data;
};