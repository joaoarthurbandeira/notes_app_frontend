import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

// -------------------
// Creating our Provider (that gives information to the consumers):
export const AuthProvider = ({ children }) => {
  //We check if we have a token. If we do, we get that token, we parse it and get back the object. Else, the value will be 'null'.
  // We want to use a callback function cause every single time this component is rendered, the AuthProvider, as we navigate through our website, is always going to be updating  and it's always going to check the local storage and we dont want to do that.
  //We put the entire ternary operator value inside a callback arrow function, making so that the value will only be set once on the initial load and it wont call it every single time, making it more efficient(not so expensive on the browser always having to call that)
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true); //loading is gonna tell us if everything inside of our auth provider is done and ready to go and if we can render out those child components.

  const history = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      // console.log(data);
      setUser(jwt_decode(data.access));
      // console.log(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      // console.log(JSON.stringify(data));
      history("/");
    } else if (response.status === 401) {
      alert("Username/Password incorrect.");
    } else {
      alert("Something went wrong");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    history("/login");
  };

  let updateToken = async () => {
    console.log("Update token called!");
    let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: authTokens?.refresh,
      }), //send the refresh token to the backend.
    });
    let data = await response.json(); //get the data

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
    console.log(loading);
  };

  let contextData = {
    //everything you wanna pass to the other components should be in here.
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
// The 'value' is what we want to be available everywhere throughout the application
// Then, simply wrap with this <AuthProvider> component the components in which you want the 'value' to be available.
