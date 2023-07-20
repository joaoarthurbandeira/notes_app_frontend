import { createContext, useState, useEffect, ReactNode } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import config from "../config";

interface AuthContextType {
  authTokens: Tokens | null;
  user: User | null;
  loading: boolean;
  errorMessage: string;
  loginUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  logoutUser: () => void;
  fetchFromApi: (
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: any
  ) => Promise<{ response: Response; data: any }>;
  registerUser: (
    userinfo: User & { password1: string; password2?: string }
  ) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setAuthTokens: React.Dispatch<React.SetStateAction<Tokens | null>>; //Here, authTokens is initialized from local storage. If the relevant item is found in local storage, it's parsed as a Tokens object. If not found, it's set to null.
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // <-- Specified type for createContext
interface AuthProviderProps {
  // <-- Defined interface for AuthProvider props
  children: ReactNode;
}
interface User {
  username: string;
  email: string;
}
interface Tokens {
  access: string;
  refresh: string;
}

interface Note {
  user: number | string; // Assuming user is represented by ID or username in the Note object
  body: string;
  updated: Date;
  created: Date;
}
interface LoginData {
  access: string;
  refresh: string;
}
interface RegisterData {
  [key: string]: any; // Represents a dynamic object. Refine this once the exact structure is known.
}

// -------------------
// Creating our Provider (that gives information to the consumers):
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // <-- Specified React.FC and props type

  //We check if we have a token. If we do, we get that token, we parse it and get back the object. Else, the value will be 'null'.
  // We want to use a callback function cause every single time this component is rendered, the AuthProvider, as we navigate through our website, is always going to be updating  and it's always going to check the local storage and we dont want to do that.
  //We put the entire ternary operator value inside a callback arrow function, making so that the value will only be set once on the initial load and it wont call it every single time, making it more efficient(not so expensive on the browser always having to call that)
  const [authTokens, setAuthTokens] = useState<Tokens | null>(() =>
    // // Added type annotation, specifying state types
    localStorage.getItem("authTokens")
      ? (JSON.parse(localStorage.getItem("authTokens") as string) as Tokens) // <-- Added type assertion for JSON.parse result
      : null
  );
  const [user, setUser] = useState<User | null>(() =>
    //  Added type annotation, specifying state types
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens") as string) // <-- Added type assertion
      : null
  );
  const [loading, setLoading] = useState<boolean>(true); // <-- Specified state type
  //loading is gonna tell us if everything inside of our auth provider is done and ready to go and if we can render out those child components. We don't wanna render any children until the component is finished loading. We don't want to accidentally render the home page or a page that should be protected untill we've checked the auth of a user, for example. By default, we set it to true, so when we first open it up, we make sure we're on a loading state.

  const [errorMessage, setErrorMessage] = useState<string>(""); // <-- Specified state type

  const history = useNavigate();

  const loginUser = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    // [MODIFIED] Added parameter and return type
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    //Since the fetch function in JavaScript returns a Response object that has several properties and methods (like status, json(), etc.), we can utilize TypeScript's built-in Response type for this purpose.
    let response: Response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: target.username.value,
        password: target.password.value,
      }),
    });
    let data: LoginData = await response.json();
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

  const API_BASE = config.API_BASE;

  const fetchFromApi = async (
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: any
  ): Promise<{ response: Response; data: LoginData | RegisterData }> => {
    //Added parameter types and return type
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data: LoginData | RegisterData = await response.json();
      console.log("PARSED_JSON_DATA:", data);
      console.log("RESPONSE_OBJECT:", response);
      return { response, data }; // Return both response and data
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const registerUser = async (
    userinfo: User & { password1: string; password2?: string }
  ): Promise<void> => {
    //Added parameter type and return type
    setLoading(true);
    setErrorMessage("");

    try {
      let {
        response: registerResponse,
        data: registerData,
      }: { response: Response; data: RegisterData } = //type annotation
        await fetchFromApi("/api/register/", "POST", {
          username: userinfo.username,
          email: userinfo.email,
          password: userinfo.password1,
        });

      if (registerResponse.status === 201) {
        // Explicitly check for a "201 Created" status
        console.log("User registered successfully.");

        // Now, proceed to log in the user
        let { response: loginResponse, data: tokens } = await fetchFromApi(
          "/api/token/",
          "POST",
          {
            username: userinfo.username,
            password: userinfo.password1,
          }
        );

        if (loginResponse.status === 200) {
          if (tokens.access && tokens.refresh) {
            // Handle tokens as before...
            setAuthTokens(tokens as LoginData); //type assertion to LoginData
            setUser(jwt_decode((tokens as LoginData).access)); //type assertion to LoginData
            localStorage.setItem("authTokens", JSON.stringify(tokens));
            history("/");
            console.log("User logged in: ", tokens);
            // ...
          } else {
            console.error("Login failed. Unexpected response from server.");
          }
        } else {
          // Handle login errors here...
          console.error("Error logging in:", loginResponse);
        }
      } else if (registerResponse.status !== 201) {
        if (
          registerData.username &&
          registerData.username.includes(
            "A user with that username already exists."
          )
        ) {
          setErrorMessage("Username already taken.");
        } else {
          // Handle other registration errors or set other error messages
          // setErrorMessage("Some generic error message");
          console.error("Registration error:", registerData);
        }
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  let contextData: AuthContextType = {
    //everything you wanna pass to the other components should be in here.
    user: user,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    registerUser,
    setErrorMessage,
    errorMessage,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};
// The 'value' is what we want to be available everywhere throughout the application
// Then, simply wrap with this <AuthProvider> component the components in which you want the 'value' to be available.
export default AuthContext;
