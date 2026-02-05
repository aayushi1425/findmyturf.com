import { api, setAuthTokens } from './index.js';

export const login = async (payload) => {
  const { data } = await api.post('/auth/login/', payload);
  const { access, refresh, role } = data;
  setAuthTokens({ access, refresh });
  if (role) localStorage.setItem('user_role', role);
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register/user/', payload);
  return data;
};

export const registerOwner = async (payload) => {
  const { data } = await api.post('/auth/register/owner/', payload);
  return data;
};
