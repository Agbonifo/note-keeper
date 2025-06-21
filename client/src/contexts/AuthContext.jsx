// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const res = await api.get("/users/me");
          setUser(res.data.data);
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const register = async (formData) => {
    try {
      await api.post("/auth/create-account", formData);
      navigate("/verify-email");
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  const login = async (emailOrUsername, password) => {
    try {
      const res = await api.post("/auth/login", { emailOrUsername, password });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          const userRes = await api.get("/users/me");
          setUser(userRes.data.data);
        }
        
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };




  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

