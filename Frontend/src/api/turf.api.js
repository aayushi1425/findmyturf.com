import { api } from './index.js';

export const listTurfs = async (params) => {
  const { data } = await api.get('/turf/list/', { params });
  return data;
};

export const getTurf = async (turfId) => {
  const { data } = await api.get(`/turf/${turfId}/`);
  return data;
};

export const createTurf = async (payload) => {
  const { data } = await api.post('/turf/create/', payload);
  return data;
};

export const updateTurf = async (turfId, payload) => {
  const { data } = await api.patch(`/turf/${turfId}/update/`, payload);
  return data;
};

export const uploadTurfImage = async (turfId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post(`/turf/${turfId}/image/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const setDefaultTurfImage = async (imageId) => {
  const { data } = await api.post(`/turf/image/${imageId}/set-default/`);
  return data;
};

export const deleteTurfImage = async (imageId) => {
  const { data } = await api.delete(`/turf/image/${imageId}/delete/`);
  return data;
};

export const listOwnerTurfs = async () => {
  const { data } = await api.get('/owner/turfs/');
  return data;
};

export const listOwnerTurfBookings = async (turfId) => {
  const { data } = await api.get(`/owner/turf/${turfId}/bookings/`);
  return data;
};
