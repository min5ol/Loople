import axiosInstance from './instance';

export const login = async ({ email, password }) => {
  const res = await axiosInstance.post('/users/login', { email, password });
  return res.data;
};