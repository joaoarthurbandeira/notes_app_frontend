import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import ListItem from "../components/ListItem";
import AddButton from "../components/AddButton";

const HomePage = () => {
  let [notes, setNotes] = useState([]);
  let { authTokens, logoutUser } = useContext(AuthContext);

  let api = useAxios();
  const location = useLocation();

  useEffect(() => {
    getNotes();
  }, []);

  // useEffect(() => {
  //   console.log(location);
  // });

  useEffect(() => {
    location.pathname === "/" ? getNotes() : null;
  }, [location.key]);
  // useEffect(() => {
  //   getNotes();
  // }, [location.key]);

  let getNotes = async () => {
    let response = await api.get("/api/notes/");
    // let response = await fetch("http://127.0.0.1:8000/api/notes/", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + String(authTokens.access),
    //   },
    // });
    // let data = await response.json();

    if (response.status === 200) {
      setNotes(response.data);
    }
    // } else if (response.statusText === "Unauthorized") {
    //   logoutUser();
    // }
  };

  return (
    <>
      <div
        className={`w-full  flex flex-col items-center    container mx-auto  bg-slate-300 relative `}>
        <div className=" notes-header text-4xl text-orange-500 block w-full font-bold p-4 flex ">
          <p className="notes-title "> &#9782; Notes: </p>
          <p className="notes-count pl-2   ">{notes.length}</p>
        </div>

        <ul className="notes-list  flex flex-col justify-center  w-full font-semibold    ">
          {notes.map((note) => (
            <ListItem key={note.id} note={note} />
          ))}{" "}
        </ul>
        <div className="className= fixed top-5 right-0 p-4  text-green-600 transition ease-in-out hover:scale-110 backdrop-blur  rounded-full   ">
          <AddButton />
        </div>
      </div>
    </>
  );
};
export default HomePage;
