import React from "react";
import { Link } from "react-router-dom";
import { AiFillFileAdd } from "react-icons/ai";

const AddButton = () => {
  return (
    <Link to="/note/new/">
      {" "}
      <AiFillFileAdd size="100" />
    </Link>
  );
};

export default AddButton;
