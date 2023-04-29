import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function Users() {
  const [users, SetUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8800/users");
        // Get Data from mysql
        // console.log(res.data);
        SetUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllUsers();
  }, []);

  // DELETE FUNC
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/users/` + id);
      window.location.reload();
      console.log(id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Users details</h1>
      <Link to={`/add`}>Add New</Link>
      {users.map((user) => (
        <div className="users" key={user.id}>
          <p></p>
          <span>{user.id}</span>
          <h2>{user.name}</h2>
          <p> {user.email}</p>
          <span>{user.phone}</span>
          <button className="delete" onClick={() => handleDelete(user.id)}>
            Delete
          </button>
          <button className="update">
            <Link to={`/update/${user.id}`}>Update</Link>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Users;
