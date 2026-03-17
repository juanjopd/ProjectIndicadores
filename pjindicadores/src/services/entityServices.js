import api from '@/lib/api';

export const createEntity = async (data) => {
  const res = await api.post('/users/entity', data);
  return res.data;
};

export const getEntities = async () => {
  const res = await api.get('/users/entity');
  return res.data;
};

export const updateEntity = async (id, data) => {
  const res = await api.put(`/users/entity/${id}`, data);
  return res.data;
};

export const toggleEntity = async (id) => {
  const res = await api.patch(`/users/entity/${id}/toggle`);
  return res.data;
};
