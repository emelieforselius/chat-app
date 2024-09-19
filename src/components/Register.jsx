import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, getCsrfToken } from "../api";
import styles from "./Register.module.css";


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    let csrfToken;

    try {
      csrfToken = await getCsrfToken();
      await registerUser({ username, email, password, csrfToken });
      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log("Error during registration:", err)

      if (err.message) {
        setError(err.message);
      } else {
        setError("Registration failed"); 
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Registrera dig här</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Användarnamn"
          className={styles.input}
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-post"
          className={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lösenord"
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button}>
          Registrera
        </button>
      </form>
      <p className={styles.loginLink}>
        Har du redan ett konto? <Link to="/login">Logga in</Link>
      </p>
    </div>
  );
};

export default Register;
