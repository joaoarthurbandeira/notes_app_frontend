import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const HomePage = () => {
  let [notes, setNotes] = useState([]);
  let { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    getNotes();
  }, []);

  let getNotes = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/notes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setNotes(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center gap-20">
        <div className="  text-4xl text-blue-700 flex items-center justify-center">
          <p>You are logged to the home page!</p>
        </div>
        <ul className=" text-4xl text-green-700 flex flex-col justify-center gap-6">
          {notes.map((note) => (
            <li key={note.id}>
              {"• "}
              {note.body}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HomePage;
