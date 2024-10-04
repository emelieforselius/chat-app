import { createContext, useEffect, useState } from "react";
import { getCsrfToken, loginUser, registerUser } from "../api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedAvatar = localStorage.getItem("avatar");

   if (storedToken) {
    try {
      const decodedJwt = JSON.parse(atob(storedToken.split(".")[1]));
      setUserId(decodedJwt.id);
    } catch(err) {
      console.error("Failed to decode JWT:", err);
    }
   }

    if (storedUser  && storedUserId) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setUserId(storedUserId);
      setAvatar(storedAvatar);
    } else {
      setUser(null);
      setToken(null);
      setUserId(null);
      setAvatar(null);
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password, avatar) => {
    try {
      const csrfToken = await getCsrfToken();
      await registerUser({ username, email, password, csrfToken, avatar });
      
      alert("Registration successful. Redirecting to login...");
      navigate("/login");
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const login = async (username, password) => {
    try {
      const csrfToken = await getCsrfToken();
      const userData = await loginUser({ username, password, csrfToken });
      const decodedJWT = JSON.parse(atob(userData.token.split(".")[1]));

      setUser({ ...userData, decodedJWT });
      setToken(userData.token);
      setUserId(decodedJWT.id);
      setUsername(decodedJWT.user);
      setAvatar(decodedJWT.avatar);

      localStorage.setItem("user", JSON.stringify({ ...userData, decodedJWT }));
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userId", decodedJWT.id);
      localStorage.setItem("username", decodedJWT.user);
      localStorage.setItem("avatar", decodedJWT.avatar);

      navigate("/chat");
    } catch (err) {
      console.error("Login failed:", err.message);
      console.error("Login failed:", err.response ? err.response.data : err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserId(null);
    setAvatar(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("avatar");

    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading, avatar, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};
