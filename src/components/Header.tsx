import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <div className="w-full  text-4xl text-white bg-slate-700 flex  justify-center fixed gap-1">
      <Link to="/">Home</Link>
      <span> | </span>
      {user ? (
        <p className="cursor-pointer" onClick={logoutUser}>
          Logout
        </p>
      ) : (
        <Link to="/login">Login</Link>
      )}

      {user && (
        <>
          <span> | </span> <p>Hello, {user.username}.</p>
        </>
      )}
    </div>
  );
};

export default Header;
