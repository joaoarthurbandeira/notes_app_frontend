import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  let { loginUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []); //This makes so a user can only be in this login page if they are logged out. Or else - if they're logged in -, they'll be redirected to home page.

  return (
    <div className="w-full h-60v text-4xl text-green-700 flex flex-col gap-6 items-center justify-center ">
      <form onSubmit={loginUser} className="flex flex-col gap-14   ">
        <span className="flex flex-col  container mx-auto gap-2 justify-center gap-10 align-middle">
          <input
            className="shadow-md rounded-md text-center"
            type="text"
            name="username"
            placeholder="Enter username... "></input>
          <input
            className="shadow-md rounded-md text-center"
            type="password"
            name="password"
            placeholder="Enter password..."></input>
        </span>
        <input
          className="bg-slate-400 rounded-3xl p-3 text-white cursor-pointer self-center "
          type="submit"></input>
      </form>
    </div>
  );
};

export default LoginPage;
