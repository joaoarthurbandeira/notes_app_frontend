import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios";

let getTime = (note) => {
  return new Date(note.updated).toLocaleDateString();
};

let getTitle = (note) => {
  let title = note.body.split("\n")[0];
  if (title.length > 45) {
    return title.slice(0, 45);
  }
  return title;
};

let getContent = (note) => {
  let title = getTitle(note);
  let content = note.body.replaceAll("/n", " ");
  content = content.replaceAll(title, "");

  if (content.length > 45) {
    return content.slice(0, 45) + "...";
  } else {
    return content;
  }
};

const ListItem = ({ note }) => {
  const history = useNavigate();

  let api = useAxios();

  let deleteNote = async (noteid) => {
    let response = await api.delete(`/api/notes/${noteid}/delete/`);
    history("/");
  };
  return (
    <>
      <div className="p-4 hover:bg-white border-b-2 transition ease-in-out relative grid grid-cols-6 sm:grid-cols-7 items-center ">
        <Link
          className=" col-span-5 sm:col-span-6    "
          to={`/note/${note.id}/`}>
          <li className="notes-list-item  ">
            <h3 className="text-2xl text-green-700">{getTitle(note)}</h3>
            <p>
              <span className="pr-2">{getTime(note)}</span>
              <span>{getContent(note)}</span>
            </p>
          </li>
        </Link>
        <button
          className="font-bold bg-white rounded-2xl p-2 border border-slate-700 col-span-1  min-w-[64px]    "
          onClick={() => deleteNote(note.id)}>
          Delete
        </button>
      </div>
    </>
  );
};

export default ListItem;
