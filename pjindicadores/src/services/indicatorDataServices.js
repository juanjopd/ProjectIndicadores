import api from '@/lib/api';

export const getIndicatorData = async (
  indicatorId,
  year
) => {

  const res = await api.get(
    `/indicator-data/${indicatorId}/${year}`
  );

  return res.data;
}; 

export const saveIndicatorData = async (data) => {

  const res = await api.post(
    '/indicator-data',
    data
  );

  return res.data;
};

export const deleteIndicatorData = async (id) => {

  const res = await api.delete(
    `/indicator-data/${id}`
  );

  return res.data;
};