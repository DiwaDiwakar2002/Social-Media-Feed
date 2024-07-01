import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminControl = () => {
  const [userListData, setUserListData] = useState([]);

  const fetchUserList = async () => {
    try {
      const res = await axios.get("/user-list");
      setUserListData(res.data);
    } catch (error) {
      console.error("Error in fetching user list");
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleUserDelete = async (id) => {
    const isConfirmed = confirm("Are you sure want to delete?");
    if (isConfirmed) {
      try {
        await axios.delete(`/user-delete/${id}`);
        fetchUserList();
      } catch (error) {
        console.error("error in deleting user", error);
      }
    }
  };

  return (
    <section className="admin-control flex flex-col mt-10 gap-5">
      <h1>Users</h1>
      {userListData.length > 0 &&
        userListData.map((userList, userIndex) => (
          <div className="bg-white p-5 rounded-lg shadow-lg" key={userIndex}>
            <h2 className="text-xl font-medium">
              {userList.name} <span></span>
            </h2>
            <h2 className="text-gray-600">{userList.email}</h2>
            <p>User Id: {userList._id}</p>
            {userList._id == "66825172469cbb92854e57db" ? (
              ""
            ) : (
              <button
                className="bg-red-600 text-white px-5 py-1 rounded-md mt-3"
                onClick={() => handleUserDelete(userList._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
    </section>
  );
};

export default AdminControl;
