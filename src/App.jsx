import React, { useContext } from "react";
import { AuthContext, AuthProvider } from "./components/AuthProvider";
import Register from "./components/Register";
import Login from "./components/Login";
import Chat from "./components/Chat";
import styles from "./components/App.module.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

const App = () => {
  return (
    <AuthProvider>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/chat" element={<Layout><Chat /></Layout>} />
            </Route>
          </Routes>
    </AuthProvider>
  );
};

export default App;
