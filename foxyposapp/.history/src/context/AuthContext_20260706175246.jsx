import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const login = (userToken, userRole) => {
    setToken(userToken);
    setRole(userRole);

    localStorage.setItem("token", userToken);
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setToken("");
    setRole("");

    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);