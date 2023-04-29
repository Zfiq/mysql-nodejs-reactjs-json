import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function Add() {
  const [users, SetUsers] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const handleChange = (e) => {
    SetUsers((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/users", users);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };
  return (
    <div className="form">
      <h1>Add New User</h1>

      <input
        type="text"
        placeholder="Name"
        name="name"
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="Email"
        name="email"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Phone"
        name="phone"
        onChange={handleChange}
      />

      <button onClick={handleClick}>Add</button>
      {error && "Something went wrong!"}
      <Link to="/">See all Users</Link>
    </div>
  );
}

export default Add;
