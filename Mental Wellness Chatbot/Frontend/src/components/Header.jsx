import React from "react";
import {
  FaPlaneDeparture,
  FaHome,
  FaUserCircle,
  FaSignOutAlt,
  FaListAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdHealthAndSafety } from "react-icons/md";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-700 shadow-md p-4 flex items-center justify-between h-[80px] sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <MdHealthAndSafety className="text-white text-[30px]" />
        <h1 className="text-white text-[30px] font-bold tracking-wide">
          Mental Wellness Chatbot
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-16 text-[18px]">
        <Link
          to="/landing"
          className="text-white flex items-center space-x-2 hover:text-yellow-300 transition-colors"
        >
          <FaHome />
          <span>Home</span>
        </Link>
        <Link
          to="/addGuardian"
          className="text-white flex items-center space-x-2 hover:text-yellow-300 transition-colors"
        >
          <FaListAlt />
          <span>Add Guardians</span>
        </Link>

        <Link
          to="/"
          className="text-white flex items-center space-x-2 hover:text-red-500 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
