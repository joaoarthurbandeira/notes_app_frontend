import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

const NotePage = (props) => {
  const { id } = useParams();
  const history = useNavigate();
  const textareaRef = useRef(null); // Create a ref to reference the textarea element
  const location = useLocation();

  let [note, setNote] = useState(null); // Declare the note state

  // Call the adjustTextareaSize function when the note state changes
  useEffect(() => {
    getNote();
  }, [id]);

  useEffect(() => {
    adjustTextareaSize();
  }, [note]);

  // useEffect(() => {
  //   console.log(location);
  // });

  let api = useAxios();

  let getNote = async () => {
    if (id === "new") return;
    let response = await api.get(`/api/notes/${id}/`);

    if (response.status === 200) {
      setNote(response.data);
    }
  };

  let createNote = async () => {
    let response = await api.post(`/api/notes/create/`, note);
    history("/");
  };

  let updateNote = async () => {
    let response = await api.put(`/api/notes/${id}/update/`, note);
    history("/");
  };

  let deleteNote = async () => {
    let response = await api.delete(`/api/notes/${id}/delete/`);
    history("/");
  };

  let handleSubmit = () => {
    console.log("NOTE", note);
    history("/");
    if (id !== "new" && note.body === "") {
      deleteNote();
    } else if (id !== "new") {
      updateNote();
    } else if (id === "new" && note.body !== null) {
      createNote();
    }
  };

  // Function to handle changes in the textarea value
  let handleChange = (value) => {
    setNote((note) => ({ ...note, body: value })); // Update the note state with the new textarea value
    // console.log("Handle Change:", note);
  };
  // setNote({ ...note, body: e.target.value })

  // Function to handle resizing of the textarea element
  const adjustTextareaSize = () => {
    const textarea = textareaRef.current; // Get the textarea element
    textarea.style.height = "auto"; // Reset the height to auto
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scrollHeight value
  };

  return (
    <div className="note  flex flex-col items-center container mx-auto bg-slate-300   ">
      <div className="p-8 flex justify-between w-full text-orange-500 text-2xl ">
        {" "}
        <BsFillArrowLeftCircleFill
          size="40"
          onClick={handleSubmit}
          className="bg-white rounded-3xl cursor-pointer"
        />
        {id !== "new" ? (
          <button
            className="font-bold bg-white rounded-2xl p-2 border border-slate-700"
            onClick={deleteNote}>
            Delete
          </button>
        ) : (
          <button
            className="font-bold bg-white rounded-2xl p-2 border border-slate-700"
            onClick={handleSubmit}>
            Done
          </button>
        )}
      </div>
      <textarea
        placeholder="Digite aqui..."
        ref={textareaRef} // Assign the ref to the textarea element
        onChange={(e) => {
          //Call the handleChange function on textarea value change
          handleChange(e.target.value);
        }}
        value={note?.body} // Set the value of the textarea to the note's body property
        className="text-3xl w-full h-96 bg-slate-300 p-4 text-green-700 resize-none"></textarea>
    </div>
  );
};

export default NotePage;
