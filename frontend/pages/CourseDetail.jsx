import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../src/store/auth";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  const {isLoggedIn,storetokenInLS, LogoutUser,user,token} = useAuth();
  // console.log("Frontend token:", token);
  //  console.log(isLoggedIn);
  //  console.log(storetokenInLS);
  //  console.log(LogoutUser);
  //  console.log(user);
  //  console.log(token);

  const [isRead, setIsRead] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (!course || !user) return;

    const readIds = user.coursesRead?.map((c) => c._id) || [];
    const addedIds = user.coursesAdded?.map((c) => c._id) || [];

    setIsRead(readIds.includes(course._id));
    setIsInCart(addedIds.includes(course._id));
  }, [course, user]);

  const handleToggle = async (type) => {
    const url =
      type === "read"
        ? `http://localhost:5000/api/cart/toggle-read/${course._id}`
        : `http://localhost:5000/api/cart/toggle-cart/${course._id}`;

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
        if (type === "read") setIsRead(!isRead);
        else setIsInCart(!isInCart);
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
      <div>
        <p>No course data found.</p>
        <button onClick={() => navigate("/courses")}>Back to Courses</button>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <div className="course-detail-image">
        <img src="/2606584_5920.jpg" alt={course.title} />
      </div>

      <div className="course-detail-info">
        <h2>{course.title}</h2>
        <p>{course.description}</p>

        <div className="tags">
          {course.category?.map((cat, idx) => (
            <span key={idx} className="tag">{cat}</span>
          ))}
        </div>

        <div className="course-actions">
  <button
    className={`read-btn  ${isRead ? "remove" : "add"}`}
    onClick={() => handleToggle("read")}
  >
    {isRead ? "Unmark Read" : "Mark as Read"}
  </button>

  <button
    className={`cart-btn ${isInCart ? "remove" : "add"}`}
    onClick={() => handleToggle("cart")}
  >
    {isInCart ? "Remove from Cart" : "Add to Cart"}
  </button>
</div>

      </div>
    </div>
  );
};

export default CourseDetail;
