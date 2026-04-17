import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function Layout() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default Layout;
