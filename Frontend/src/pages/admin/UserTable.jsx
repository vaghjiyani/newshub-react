import React from "react";
import "./UserTable.css";

const dummyUsers = [
  { id: 1, name: "Vaghamsi Sumit", email: "svaghamashi807@rku.ac.in", phone: "1234567890" },
  { id: 2, name: "Vaghiyani Hiten", email: "hvaghiyani805@rku.ac.in", phone: "1234567890" },
  { id: 3, name: "Vadher Deep", email: "dvadher111@rku.ac.in", phone: "1234567890" },
];

function UserTable() {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User Name</th>
          <th>Email</th>
          <th>Mobile No</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {dummyUsers.map((user) => (
          <tr key={user.id}>
            <td><b>{user.id}</b></td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>
              <button className="edit-btn">✏️</button>
              <button className="delete-btn">🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;
