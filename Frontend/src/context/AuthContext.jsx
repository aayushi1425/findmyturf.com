import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const login = (access, role) => {
    localStorage.setItem("access", access);
    localStorage.setItem("role", role);
    setToken(access);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
