import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div className="w-full h-screen text-4xl text-blue-700 flex items-center justify-center">
      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter Username"></input>
        <input
          type="password"
          name="password"
          placeholder="Enter Password"></input>
        <input
          className="bg-slate-400 rounded-3xl p-3 text-white cursor-pointer"
          type="submit"></input>
      </form>
    </div>
  );
};

export default LoginPage;
