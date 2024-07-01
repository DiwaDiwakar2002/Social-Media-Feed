import React, { useContext } from "react";
import UserInfo from "../Components/UserInfo";
import UserPosts from "../Components/UserPosts";
import { Context } from "../UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import AdminControl from "../Components/AdminControl";
import AddNewPost from "../Components/AddNewPost";

const AcccountPage = () => {
  const { user, accountRedirect, ready } = useContext(Context);
  console.log(user);
  const navigate = useNavigate();

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

  if (ready && !user && !accountRedirect) {
    return <Navigate to={"/login"} />;
  }

  if (accountRedirect) {
    return <Navigate to={accountRedirect} />;
  }
  return (
    <div className="flex flex-col gap-3">
      <UserInfo />
      <AddNewPost />
      {user.id == "66825172469cbb92854e57db" ? <AdminControl /> : <UserPosts />}
    </div>
  );
};

export default AcccountPage;
