import React, { createContext, useEffect, useMemo, useState } from 'react';
import { clearAuthTokens, setAuthTokens } from '../api/index.js';
import { login as loginApi, registerOwner, registerUser } from '../api/auth.api.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [role, setRole] = useState(localStorage.getItem('user_role'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    if (role) localStorage.setItem('user_role', role);
  }, [accessToken, refreshToken, role]);

  const login = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(payload);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      setRole(data.role);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload, type = 'user') => {
    setLoading(true);
    setError(null);
    try {
      if (type === 'owner') {
        return await registerOwner(payload);
      }
      return await registerUser(payload);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthTokens();
    setAuthTokens({});
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
  };

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      role,
      isAuthenticated: Boolean(accessToken),
      loading,
      error,
      login,
      register,
      logout,
    }),
    [accessToken, refreshToken, role, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
