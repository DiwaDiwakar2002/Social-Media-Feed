import React from "react";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-300">
      <div className="py-4 lg:px-16 md:px-10 sm:px-7 px-5 bg-white">
        <Header />
      </div>
      <div className="py-4 lg:px-16 md:px-10 sm:px-7 px-5" >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
