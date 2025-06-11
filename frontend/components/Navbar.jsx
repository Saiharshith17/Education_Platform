import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../src/store/searchContext";
import "./Navbar.css";

const Navbar = () => {
 const { searchInput, setSearchInput } = useSearch();

  const [suggestions, setSuggestions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses/categories");
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
        <div className="navbar-logo">EduPlatform</div>

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
