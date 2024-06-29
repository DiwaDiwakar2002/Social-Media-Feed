import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  // state for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  //   store formdata to state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // send formdata to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log(res);
      alert("Registration Successful :)");
    } catch (error) {
      console.log(error);
      alert("Registration Failed :(");
    }
  };

  return (
    <>
      <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-32">
          <h1 className="text-4xl text-center mb-5">Register</h1>
          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <input
              required
              type="text"
              placeholder="your name"
              value={formData.name}
              name="name"
              onChange={handleChange}
            />
            <input
              required
              type="email"
              placeholder="your@gmail.com"
              value={formData.email}
              name="email"
              onChange={handleChange}
            />
            <input
              required
              type="password"
              placeholder="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
            />
            <button className="primary">Register</button>
            <div className="text-center text-gray-500 py-2">
              Have an account?{" "}
              <Link to={"/login"} className="text-primary underline">
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
