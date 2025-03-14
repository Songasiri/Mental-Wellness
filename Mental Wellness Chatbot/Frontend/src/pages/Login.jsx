import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdHealthAndSafety } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/landing");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[url('https://kama.ai/mecuhir/uploads/2022/02/News-Post-Cover.png')] bg-cover">
      {/* Custom Header */}
      <header className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-700 shadow-md p-4 flex items-center justify-between h-[80px]">
        <div className="flex items-center space-x-2">
          <MdHealthAndSafety className="text-white text-[30px]" />
          <h1 className="text-white text-[30px] font-bold tracking-wide">Mental Wellness ChatBot</h1>
        </div>
      </header>

      <div className="flex flex-grow items-center justify-center backdrop-blur-sm">
        <div className="bg-opacity-65 bg-white shadow-lg rounded-lg p-8 max-w-md w-full font-serif">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-purple-500 text-center hover:bg-purple-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Sign In
              </button>
            </div>

            <p className="text-center text-gray-600 text-[16px] mt-4">
              Don't have an account? {" "}
              <Link to="/register" className="text-purple-500 hover:text-purple-700 font-bold">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;