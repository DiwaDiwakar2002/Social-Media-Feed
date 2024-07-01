import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../UserContext";

const Header = () => {
  const { user } = useContext(Context);

  return (
    <header className="flex justify-between">
      <Link to={"/home"} href="" className="flex items-center gap-1 text-primary">
        <span className="font-bold text-3xl">insta</span>
      </Link>
      <Link
        to={user ? "/account" : "/"}
        className="flex items-center gap-2 primary rounded-md py-2 px-4 text-white font-semibold"
      >
        <div className="bg-primary text-white rounded-full border overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 relative top-1"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {!!user && <div>{user.name}</div>}
      </Link>
    </header>
  );
};

export default Header;
