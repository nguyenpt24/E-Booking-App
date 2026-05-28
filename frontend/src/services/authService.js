import axios from '../api/client';

export const login = async (username, password) => {
  const res = await axios.post('/auth/login', { username, password });
  return res.data;
};

export const register = async (authData) => {
  const res = await axios.post('/auth/register', authData);
  return res.data;
};
