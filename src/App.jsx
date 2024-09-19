import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Chat from "./components/Chat";
import SideNav from "./components/SideNav";
import styles from "./components/App.module.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        setUser(storedUser);
    }
}, []);

const handleLogin = (userData) => {

  setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
};

const handleLogout = () => {
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  Navigate('/login');
};

return (
<Router>
  <div className={styles.appContainer}>
    {user && <SideNav user={user} onLogout={handleLogout}/>}
    <div className={styles.mainContent}>
    <Routes>
      <Route path="/register" element={!user ? <Register/> : <Navigate to="/chat"/>} />
      <Route path="/login" element={!user ? <Login onLogin={handleLogin}/> : <Navigate to="/chat"/> } />
      <Route path="/chat" element={user ? <Chat user={user} /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
    </Routes>
    </div>
  </div>
</Router>
);
};

export default App;