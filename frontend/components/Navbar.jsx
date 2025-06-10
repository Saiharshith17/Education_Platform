// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
     
     
      <div className="navbar-left">
        <div className="navbar-logo">EduPlatform</div>
       
       
       <div className="navbar-center">
        <input type="text" className="search-input" placeholder="Search courses..." />
      </div>

        <ul className="navbar-links">
          <li><Link to="/Home">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/books">Books</Link></li>
          <li><Link to="/quizzes">Quizzes</Link></li>
          <li><Link to="/chatbot">Chatbot</Link></li>
        </ul>
      </div>

      

      <div className="navbar-right">
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
