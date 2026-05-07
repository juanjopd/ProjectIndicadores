import api from '@/lib/api';

export const createIndicator = async (data) => {
  const res = await api.post('/indicator', data);
  return res.data;
};

export const getTypes = async () => {
  const res = await api.get('/indicator/indicator-types');
  return res.data;
};

export const getTrends = async () => {
  const res = await api.get('/indicator/indicator-trends');
  return res.data;
};