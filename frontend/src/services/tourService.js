import axios from '../api/client';

export const getTours = async () => {
  const res = await axios.get('/tours');
  return res.data;
};

export const searchTours = async ({ destination, maxPrice, departureDate }) => {
  let url = '/tours/search?';
  const params = [];
  if (destination) params.push(`destination=${encodeURIComponent(destination)}`);
  if (maxPrice) params.push(`maxPrice=${maxPrice}`);
  if (departureDate) params.push(`departureDate=${departureDate}`);
  url += params.join('&');
  const res = await axios.get(url);
  return res.data;
};

export const createTour = async (tourData) => {
  const res = await axios.post('/tours', tourData);
  return res.data;
};

export const updateTour = async (id, tourData) => {
  const res = await axios.put(`/tours/${id}`, tourData);
  return res.data;
};

export const deleteTour = async (id) => {
  const res = await axios.delete(`/tours/${id}`);
  return res.data;
};
