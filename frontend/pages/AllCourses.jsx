import React, { useEffect, useState } from "react";
import "./AllCourses.css";
import "./CourseLoader.css";

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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Add scroll-triggered animations
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
  }, [loading]);

  return (
    <div className="courses-list">
      <h2>All Courses</h2>
      {loading ? (
        <CourseLoader />
      ) : (
        <div className="grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
           <img
  src="\public\2606584_5920.jpg"
  alt={course.title}
/>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
