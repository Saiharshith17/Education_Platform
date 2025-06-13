import React from "react";
import "./Dashboard.css";

const UserDashboard = ({ user }) => {
   
  const {
    username,
    email,
    stream,
    createdAt,
    preferences = [],
    coursesRead = [],
    coursesAdded = [],
    booksRead = [],
    booksAdded = [],
  } = user || {};

  return (
    <div className="dashboard-container">
      {/* Top Section */}
      <div className="top-section">
        <div className="user-info">
          <h2>{username}</h2>
          <p>Email: {email}</p>
          <p>Stream: {stream}</p>
          <p>User Since: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <div className="preferences">
          <h3>Preferences:</h3>
          <div className="tags">
            {preferences.map((pref, idx) => (
              <span key={idx} className="tag">
                {pref}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Section - Two Halves */}
      <div className="grid-section courses-section">
        <div className="grid-card expandable">
          <h3>Courses Read</h3>
          <div className="scroll-list">
            <ul>
              {coursesRead.map((course, idx) => (
                <li key={idx}>{course.title}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid-card expandable">
          <h3>Courses Added</h3>
          <div className="scroll-list">
            <ul>
              {coursesAdded.map((course, idx) => (
                <li key={idx}>{course.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Books Section - Two Halves Below */}
      <div className="grid-section books-section">
        <div className="grid-card expandable">
          <h3>Books Read</h3>
          <div className="scroll-list">
            <ul>
              {booksRead.map((book, idx) => (
                <li key={idx}>{book.title}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid-card expandable">
          <h3>Books Added</h3>
          <div className="scroll-list">
            <ul>
              {booksAdded.map((book, idx) => (
                <li key={idx}>{book.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
