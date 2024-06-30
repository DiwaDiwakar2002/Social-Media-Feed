import React from "react";
import UserInfo from "../Components/UserInfo";
import UserPosts from "../Components/UserPosts";

const AcccountPage = () => {
  return (
    <div>
      <div>
        <UserInfo />
      </div>
      <div>
        <UserPosts />
      </div>
    </div>
  );
};

export default AcccountPage;
