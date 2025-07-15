import React, { useState, useEffect, useRef } from "react";
import { NavLink,Link,useNavigate } from "react-router-dom";
import { useSearch } from "../src/store/searchContext";
import "./Navbar.css";
import Logout from "../pages/Logout";

const Navbar = () => {

   const [isMobileLogo, setIsMobileLogo] = useState(window.innerWidth <= 450);

  useEffect(() => {
    const handleResize = () => setIsMobileLogo(window.innerWidth <= 450);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 const { searchInput, setSearchInput } = useSearch();
 const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL_LOCAL}/api/courses/categories`);
        const data = await res.json();
        setAllCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 0) {
      const filtered = allCategories.filter((cat) =>
        cat.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (category) => {
    setSearchInput(category);
    setSuggestions([]);
    navigate(`/courses?search=${category}`);
  };

  // 👇 Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">{isMobileLogo ? "Edu" : "EduPlatform"}</div>

        <div className="navbar-center">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search courses..."
            value={searchInput}
            onChange={handleChange}
          />
          {suggestions.length > 0 && (
            <ul className="search-suggestions" ref={suggestionRef}>
              {suggestions.map((s, i) => (
                <li key={i} onClick={() => handleSelect(s)}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
       

       <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
         <span />
          <span />
          <span />
         </div>
        <ul className={`navbar-links${menuOpen ? " open" : ""}`}>
  <li><NavLink to="/Home" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
  <li><NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>Courses</NavLink></li>
  <li><NavLink to="/books" className={({ isActive }) => isActive ? "active" : ""}>Books</NavLink></li>
  <li><NavLink to="/quizzes" className={({ isActive }) => isActive ? "active" : ""}>Quizzes</NavLink></li>
  <li><NavLink to="/chatbot" className={({ isActive }) => isActive ? "active" : ""}>Chatbot</NavLink></li>
</ul>
      </div>

      <div className="navbar-right">
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
