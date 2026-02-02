import { createContext, useState } from "react";
import { saveToken, clearToken, getToken } from "../utils/storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());

  const login = (token) => {
    saveToken(token);
    setToken(token);
  };

  const logout = () => {
    clearToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
