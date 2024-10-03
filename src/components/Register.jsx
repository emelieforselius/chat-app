import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import styles from "./Register.module.css";
import { Link } from "react-router-dom";


const avatarOptions = [
  'https://api.multiavatar.com/seed1.svg',
  'https://api.multiavatar.com/seed2.svg',
  'https://api.multiavatar.com/seed3.svg',
  'https://api.multiavatar.com/seed4.svg',
  'https://api.multiavatar.com/seed5.svg',
  'https://api.multiavatar.com/seed6.svg',
];

const Register = () => {
  const {register} = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(avatarOptions[0]); 
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register(username, email, password, avatar);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Registrera dig här</h2>
      {error && <p className={styles.error}>{error}</p>}
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

        <div className={styles.avatarContainer}>
          <h4>Välj din avatar</h4>
          <div className={styles.avatars}>
          {avatarOptions.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Avatar ${index + 1}`}
                className={`${styles.avatar} ${
                  avatar === imgUrl ? styles.selected : ""
                }`}
                onClick={() => setAvatar(imgUrl)}
              />
            ))}

          </div>
        </div>

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
