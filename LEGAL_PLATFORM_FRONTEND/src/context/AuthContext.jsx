/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { auth } from "../services/api";
import { AuthContext } from "./AuthContextDefinition";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => {
    return token || localStorage.getItem("token") || null;
  };

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      const storedResponse = JSON.parse(localStorage.getItem("authResponse"));

      if (!storedToken || !storedResponse?.data) {
        setLoading(false);
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("authResponse");
        return;
      }

      try {
        // Skip /api/auth/me since it returns 404
        setUser(storedResponse.data);
        setError(null);
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("authResponse");
        setToken(null);
        setUser(null);
        setError("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await auth.login({ email, password });
      const { token: newToken, user } = response.data.data;
      if (!newToken) throw new Error("No token in response");
      localStorage.setItem("token", newToken);
      localStorage.setItem("authResponse", JSON.stringify({ data: user }));
      setToken(newToken);
      setUser(user);
      setError(null);
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (data) => {
    try {
      const response = await auth.register(data);
      const { token: newToken, user } = response.data.data;
      if (!newToken) throw new Error("No token in response");
      localStorage.setItem("token", newToken);
      localStorage.setItem("authResponse", JSON.stringify({ data: user }));
      setToken(newToken);
      setUser(user);
      setError(null);
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await auth.forgotPassword({ email });
      setError(null);
      return { success: true, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send reset email";
      setError(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await auth.resetPassword({ token, newPassword });
      setError(null);
      return { success: true, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reset password";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authResponse");
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        getToken,
        setToken,
        loading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};