import React from "react";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import { Route, Routes } from "react-router-dom";
import FeedPage from "./Pages/FeedPage";
import Layout from "./Layout/Layout";
import axios from "axios";
import UserContext from "./UserContext";
import AcccountPage from "./Pages/AcccountPage";

// base url
axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <UserContext>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AcccountPage />} />
        </Route>
      </Routes>
    </UserContext>
  );
};

export default App;
