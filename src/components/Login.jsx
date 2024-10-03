import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import styles from "./Login.module.css";
import {Link} from 'react-router-dom';

const Login = () => {
  const {login} = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Username:", username);
    console.log("Password:", password);


    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
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
