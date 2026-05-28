import axios from '../api/client';

export const createBooking = async (bookingData) => {
  const res = await axios.post('/bookings', bookingData);
  return res.data;
};

export const payBooking = async (bookingId) => {
  const res = await axios.post(`/bookings/${bookingId}/pay`);
  return res.data;
};

export const approveBooking = async (bookingId) => {
  const res = await axios.put(`/bookings/${bookingId}/approve`);
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const res = await axios.put(`/bookings/${bookingId}/cancel`);
  return res.data;
};

export const getBookings = async () => {
  const res = await axios.get('/bookings');
  return res.data;
};

export const getRevenueReport = async () => {
  const res = await axios.get('/admin/reports/revenue');
  return res.data;
};
