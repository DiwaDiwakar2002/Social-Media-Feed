import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // store the data to useState
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // posting new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      alert("Registration Successful :)");
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration Failed :(");
    }
  };

  return (
    <>
      <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-32 bg-white py-6 px-5 w-max rounded-lg mx-auto mt-28 shadow-lg">
          <h1 className="text-4xl text-center mb-5">Register</h1>
          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <input
              required
              type="text"
              placeholder="Your name"
              value={formData.name}
              name="name"
              onChange={handleChange}
            />
            <input
              required
              type="email"
              placeholder="Your email"
              value={formData.email}
              name="email"
              onChange={handleChange}
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={formData.password}
              name="password"
              onChange={handleChange}
            />
            <button className="bg-primary text-white px-3 py-2 w-full rounded-md mt-2">
              Register
            </button>
            <div className="text-center text-gray-500 py-2">
              Have an account?{" "}
              <Link to={"/"} className="text-primary underline">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
