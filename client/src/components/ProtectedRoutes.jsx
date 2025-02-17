import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRoute = () => {
  const token = window.sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
