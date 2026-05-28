import axios from '../api/client';

export const getMembers = async () => {
  const res = await axios.get('/admin/members');
  return res.data;
};

export const adjustMemberPoints = async (memberId, pointsChange, reason) => {
  const res = await axios.put(`/admin/members/${memberId}/points`, {
    pointsChange,
    reason
  });
  return res.data;
};

export const getMemberHistory = async (memberId) => {
  const res = await axios.get(`/admin/members/${memberId}/history`);
  return res.data;
};

export const getSystemConfig = async () => {
  const res = await axios.get('/config');
  return res.data;
};

export const updateSystemConfig = async (configData) => {
  const res = await axios.put('/admin/config', configData);
  return res.data;
};
