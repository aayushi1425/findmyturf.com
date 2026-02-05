import { api } from './index.js';

export const createCourt = async (payload) => {
  const { data } = await api.post('/court/create/', payload);
  return data;
};

export const updateCourt = async (courtId, payload) => {
  const { data } = await api.patch(`/court/${courtId}/update/`, payload);
  return data;
};

export const getCourt = async (courtId) => {
  const { data } = await api.get(`/court/${courtId}/`);
  return data;
};

export const listCourtsByTurf = async (turfId) => {
  const { data } = await api.get(`/turf/${turfId}/courts/`);
  return data;
};

export const deleteCourt = async (courtId) => {
  const { data } = await api.delete(`/court/${courtId}/delete/`);
  return data;
};

export const getAvailableSlots = async (courtId, date) => {
  const { data } = await api.get(`/court/${courtId}/available-slots/`, {
    params: { date },
  });
  return data;
};
