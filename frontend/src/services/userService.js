import axios from '../api/client';

export const getUserProfile = async () => {
  const res = await axios.get('/users/profile');
  return res.data;
};

export const updateUserProfile = async (profileData) => {
  const res = await axios.put('/users/profile', profileData);
  return res.data;
};
