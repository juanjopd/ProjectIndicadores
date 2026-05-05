import api from '@/lib/api';

export const createEntity = async (data) => {
  const res = await api.post('/entity', data);
  return res.data;
};

export const getEntities = async () => {
  const res = await api.get('/entity');
  return res.data;
};

export const updateEntity = async (id, data) => {
  const res = await api.put(`/entity/${id}`, data);
  return res.data.user;
};

export const toggleEntity = async (id) => {
  const res = await api.patch(`/entity/${id}/toggle`);
  return res.data.entity;
};
