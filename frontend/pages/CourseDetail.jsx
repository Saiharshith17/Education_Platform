// src/pages/CourseDetail.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CourseDetail.css"; // optional styling

const CourseDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  if (!course) {
    return (
      <div>
        <p>No course data found.</p>
        <button onClick={() => navigate("/courses")}>Back to Courses</button>
      </div>
    );
  }

  return (
  <div className="course-detail-container">
  <div className="course-detail-image">
    <img src="\public\2606584_5920.jpg" alt={course.title} />
  </div>

  <div className="course-detail-info">
    <h2>{course.title}</h2>
    <p>{course.description}</p>
    <div className="tags">
      {course.category?.map((cat, idx) => (
        <span key={idx} className="tag">{cat}</span>
      ))}
    </div>
  </div>
</div>
  );
};

export default CourseDetail;
