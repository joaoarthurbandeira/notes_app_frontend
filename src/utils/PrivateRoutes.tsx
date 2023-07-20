import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoutes = () => {
  let { user } = useContext(AuthContext);
  // let auth = { token: false };
  return user ? <Outlet /> : <Navigate to="/login" />; //Can't access these "Outlet" pages (child from privateroutes) if user is logged out.
};

export default PrivateRoutes;
