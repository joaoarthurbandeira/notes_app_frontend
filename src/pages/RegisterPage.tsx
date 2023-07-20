import React, { useContext, useEffect, useRef } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const registerForm = useRef(null);
  let { user, registerUser, errorMessage, setErrorMessage } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []); //This makes so a user can only be in this login page if they are logged out. Or else - if they're logged in -, they'll be redirected to home page.

  useEffect(() => {
    return () => {
      // console.log("RegisterPage unmounts");
      setErrorMessage("");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = registerForm.current.username.value;
    const email = registerForm.current.email.value;
    const password1 = registerForm.current.password1.value;
    const password2 = registerForm.current.password2.value;

    if (password1 !== password2) {
      alert("Passwords do not match!");
      return;
    }

    const userInfo = { username, email, password1, password2 };
    registerUser(userInfo);
  };

  const handleInputChange = () => {
    setErrorMessage("");
  };

  return (
    <div className="w-full h-70v text-4xl text-green-700 flex flex-col gap-6 items-center justify-center ">
      <form
        ref={registerForm}
        onSubmit={handleSubmit}
        className="flex flex-col gap-14   ">
        <span className="flex flex-wrap container mx-auto gap-2 justify-center gap-10 align-middle">
          <input
            onChange={(e) => {
              handleInputChange();
            }}
            className="shadow-md rounded-md text-center"
            type="text"
            name="username"
            placeholder="Enter username... "></input>
          <input
            className="shadow-md rounded-md text-center"
            type="text"
            name="email"
            placeholder="Enter email..."></input>
          <input
            className="shadow-md rounded-md text-center"
            type="password"
            name="password1"
            placeholder="Enter password..."></input>
          <input
            className="shadow-md rounded-md text-center"
            type="password"
            name="password2"
            placeholder="Confirm password..."></input>
        </span>
        <input
          className="bg-slate-400 rounded-3xl p-3 text-white cursor-pointer self-center "
          type="submit"></input>
      </form>
      {errorMessage && (
        <p className="text-red-500 font-bold text-2xl">{errorMessage}</p>
      )}
    </div>
  );
};

export default RegisterPage;
