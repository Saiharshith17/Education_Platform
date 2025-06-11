import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AllCourses.css";
import "./CourseLoader.css";
import { useSearch } from "../src/store/searchContext";

const CourseLoader = () => {
  const loaders = Array.from({ length: 16 });
  return (
    <div className="course-loader-grid">
      {loaders.map((_, index) => (
        <div key={index} className="course-loader-card" />
      ))}
    </div>
  );
};

const AllCourses = () => {
  const { setSearchInput } = useSearch();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses");
      const data = await res.json();
      setCourses(data.courses);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const keyword = new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

    if (keyword) {
      const filtered = courses.filter((c) =>
        c.category.some((cat) => cat.toLowerCase().includes(keyword))
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }

    setSearchKeyword(keyword);
  }, [location.search, courses]);

  const handleClearSearch = () => {
    setSearchInput("");
    navigate("/courses");
  };

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.1 }
      );

      const cards = document.querySelectorAll(".course-card");
      cards.forEach((card, i) => {
        const direction = i % 4 < 2 ? "animate-left" : "animate-right";
        card.classList.add(direction);
        observer.observe(card);
      });

      return () => observer.disconnect();
    }
  }, [loading, filteredCourses]);

  return (
    <div className="courses-list">
      <h2>All Courses</h2>

      {searchKeyword && (
        <div className="search-info">
          <p>
            Showing results for <strong>{searchKeyword}</strong>
          </p>
          <button onClick={handleClearSearch} className="clear-btn">Clear Search</button>
        </div>
      )}

      {loading ? (
        <CourseLoader />
      ) : (
        <div className="grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-card">
              <img
                src={course.thumbnail || "/2606584_5920.jpg"}
                alt={course.title}
              />
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
          {filteredCourses.length === 0 && <p>No matching courses found.</p>}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
