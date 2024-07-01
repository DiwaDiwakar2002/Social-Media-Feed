import axios from "axios";
import React, { useEffect, useState } from "react";

// Component for admin control to manage users
const AdminControl = () => {
  const [userListData, setUserListData] = useState([]);

  // Function to fetch the list of users from the server
  const fetchUserList = async () => {
    try {
      const res = await axios.get("/user-list");
      setUserListData(res.data);
    } catch (error) {
      console.error("Error in fetching user list", error);
    }
  };

  // useEffect to fetch user list on component mount
  useEffect(() => {
    fetchUserList();
  }, []);

  // Function to handle user deletion
  const handleUserDelete = async (id) => {
    const isConfirmed = confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      try {
        await axios.delete(`/user-delete/${id}`);
        // Refresh the user list after deletion
        fetchUserList();
      } catch (error) {
        console.error("Error in deleting user", error);
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
              {userList.name}
            </h2>
            <h2 className="text-gray-600">{userList.email}</h2>
            <p>User Id: {userList._id}</p>
            {/* Skip the delete button for a admin user ID */}
            {userList._id === "66825172469cbb92854e57db" ? (
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
