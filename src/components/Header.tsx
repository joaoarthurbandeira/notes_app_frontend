import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const highlightLogin =
    location.pathname === "/login"
      ? "border-b border-b-[9px]   border-emerald-500 "
      : "";
  const highlightRegiser =
    location.pathname === "/register"
      ? "border-b border-b-[9px]   border-emerald-500"
      : "";

  // useEffect(() => {
  //   console.log(location);
  // });

  return (
    <div
      className={`app-header w-full  text-4xl text-white bg-slate-700 flex  justify-center  container mx-auto gap-2    `}>
      <Link to="/">Home</Link>
      <span> | </span>
      {user ? (
        <p className="cursor-pointer" onClick={logoutUser}>
          Logout
        </p>
      ) : (
        <>
          <Link to="/login" className={`${highlightLogin}`}>
            Login
          </Link>
          <span> | </span>
          <Link to="/register" className={`${highlightRegiser}`}>
            Register
          </Link>
        </>
      )}

      {user && (
        <>
          <span> | </span> <p>{user.username}</p>
        </>
      )}
    </div>
  );
};

export default Header;
