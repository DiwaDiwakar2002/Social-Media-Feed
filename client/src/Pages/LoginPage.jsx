import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../UserContext";

const LoginPage = () => {
  // context
  const { setUser } = useContext(Context);

  // login data state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // redirect state
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return <Navigate to={"/home"} />;
  }

  // store the value to the state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // login function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", {
        email: loginData.email,
        password: loginData.password,
      });
      setUser(res.data);
      alert("Login Successful");
      setRedirect(true);
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="mt-4 grow ">
      <div className="mb-32 bg-white py-6 px-5 w-max rounded-lg mx-auto mt-28 shadow-lg">
        <h1 className="text-4xl text-center mb-5">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            required
            type="email"
            placeholder="your@gmail.com"
            name="email"
            value={loginData.email}
            onChange={handleChange}
          />
          <input
            required
            type="password"
            placeholder="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
          />
          <button className="bg-primary text-white px-3 py-2 w-full rounded-md mt-2">Login</button>
          <div className="text-center text-gray-500 py-2">
            Don't have an account yet?{" "}
            <Link to={"/register"} className="text-primary underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
