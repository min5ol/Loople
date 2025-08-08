// src/apis/user.js

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

// 닉네임 변경
export const updateNickname = async (nickname) => {
  await instance.patch(`/users/nickname`, { nickname });
};

// 휴대폰 변경
export const updatePhone = async (phone) => {
  await instance.patch(`/users/phone`, { phone });
};

// 프로필 이미지 변경
export const updateProfileImage = async (imageUrl) => {
  await instance.patch(`/users/profile-image`, { imageUrl });
};