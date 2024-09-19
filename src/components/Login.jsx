import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import styles from "./Login.module.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ username, password });
      localStorage.setItem('userData', JSON.stringify(userData))
      onLogin(userData);
      navigate("/chat");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Logga in</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Användarnamn"
          required
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lösenord"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Logga in
        </button>
      </form>
      <p className={styles.registerLink}>
        Har du inget konto? <Link to="/register">Registrera dig här!</Link>
      </p>
    </div>
  );
};

export default Login;
