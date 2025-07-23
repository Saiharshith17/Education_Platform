import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../src/store/auth";
import "./CourseDetail.css";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const CourseDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;
  const { user, token } = useAuth();

  const [isRead, setIsRead] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
  if (!course || !user) return;
  setIsRead(user.coursesRead?.includes(course._id));
  setIsInCart(user.coursesAdded?.includes(course._id));
}, [course, user]);


  const handleToggle = async (type) => {
    const url =
      type === "read"
        ? `${import.meta.env.VITE_API_BASE_URL}/api/cart/toggle-read/${course._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/cart/toggle-cart/${course._id}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        if (type === "read") setIsRead((prev) => !prev);
        else setIsInCart((prev) => !prev);
        alert(result.message);
      } else {
        alert(result.message || "Action failed.");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Something went wrong.");
    }
  };

  if (!course) {
    return (
      <div className="course-detail-container">
        <p>No course data found.</p>
        <button onClick={() => navigate("/courses")}>Back to Courses</button>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <div className="course-header">
        <img
          src="/2606584_5920.jpg"
          alt={course.title}
          className="course-thumbnail"
        />

        <div className="course-header-info">
          <h1>{course.title}</h1>
          <p className="course-desc">{course.description}</p>

          <div className="meta-info">
            📅 Created on: <strong>{formatDate(course.date)}</strong><br />
            👤 Created by: <strong>{course.createdBy}</strong><br />
            👥 Enrolled Students: <strong>{course.enrolledCount}</strong>
          </div>

          <div className="tags-section">
            <h4>Categories</h4>
            <div className="tags">
              {course.category?.map((cat, idx) => (
                <span key={idx} className="tag">{cat}</span>
              ))}
            </div>
          </div>

          <div className="course-actions">
            <button
              className={isRead ? "btn remove" : "btn add"}
              onClick={() => handleToggle("read")}
            >
              {isRead ? "✔️ Unmark Read" : "📖 Mark as Read"}
            </button>
            <button
              className={isInCart ? "btn remove" : "btn add"}
              onClick={() => handleToggle("cart")}
            >
              {isInCart ? "🛒 Remove from Cart" : "🛒 Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="course-content">
        <h2>Lectures & Materials</h2>
        {course.content?.map((item) => (
          <div key={item._id} className="content-item">
            <h3>{item.title}</h3>
            <video controls src={item.videoUrl}></video>
            <a
              className="pdf-link"
              href={item.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
            >
              📄 Download PDF
            </a>
          </div>
        ))}
      </div>
      <div className="course-resources">
  <h2>Additional Resources</h2>
  <div className="resource-item">
    <a
      href="https://developer.mozilla.org/en-US/"
      target="_blank"
      rel="noopener noreferrer"
      className="resource-link"
    >
      MDN Web Docs
    </a>
  </div>
  <div className="resource-item">
    <a
      href="https://www.w3schools.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="resource-link"
    >
      W3Schools Tutorials
    </a>
  </div>
  <div className="resource-item">
    <a
      href="https://stackoverflow.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="resource-link"
    >
      Stack Overflow
    </a>
  </div>
</div>
    </div>
  );
};

export default CourseDetail;
