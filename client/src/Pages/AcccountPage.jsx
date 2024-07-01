import React, { useContext } from "react";
import UserInfo from "../Components/UserInfo";
import UserPosts from "../Components/UserPosts";
import { Context } from "../UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import AdminControl from "../Components/AdminControl";

const AcccountPage = () => {
  const { user, accountRedirect, ready } = useContext(Context);
  const navigate = useNavigate();

  // If user is not logged in, show a message and login button
  if (!ready) {
    return (
      <div className="flex flex-col justify-center items-center mt-48">
        <h1>You are logged out</h1>
        <button className="primary" onClick={() => navigate("/")}>
          Login
        </button>
      </div>
    );
  }

  // If there is a redirect path, navigate to that path
  if (accountRedirect) {
    return <Navigate to={accountRedirect} />;
  }

  // Render UserInfo component and either AdminControl or UserPosts based on user role
  return (
    <div className="flex flex-col gap-3">
      <UserInfo />
      {user.id === "66825172469cbb92854e57db" ? <AdminControl /> : <UserPosts />}
    </div>
  );
};

export default AcccountPage;
