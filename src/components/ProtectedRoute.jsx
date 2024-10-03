import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;