import { api } from './index.js';

export const createBooking = async (payload) => {
  const { data } = await api.post('/booking/create/', payload);
  return data;
};

export const listMyBookings = async () => {
  const { data } = await api.get('/booking/my/');
  return data;
};

export const getBooking = async (bookingId) => {
  const { data } = await api.get(`/booking/${bookingId}/`);
  return data;
};

export const cancelBooking = async (bookingId) => {
  const { data } = await api.post(`/booking/${bookingId}/cancel/`);
  return data;
};