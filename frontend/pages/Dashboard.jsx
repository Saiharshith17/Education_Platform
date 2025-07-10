import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Preferences from "../components/Preferences";
import {useCourseData} from "../src/store/CourseContext.jsx"
import { useBooksData } from "../src/store/booksContext.jsx";
import { Link } from "react-router-dom";


const BookCard = ({ book }) => {
  return (
    <Link to={`/books/${book._id}`} state={{ book }} className="book-card-link">
      <div className="book-card">
        <img
          src={book.thumbnail || "https://via.placeholder.com/128x192?text=No+Image"}
          alt={book.title}
          className="book-img"
        />
        <div className="book-info">
          <h4 className="book-title">{book.title}</h4>
          <p className="book-authors">
            {book.authors?.join(", ") || "Unknown Author"}
          </p>
          <p className="book-publisher">{book.publisher || "Unknown Publisher"}</p>
          <p className="book-date">{book.publishedDate || "No Date"}</p>
        </div>
      </div>
    </Link>
  );
};


const CourseCard = ({ course }) => (

  <div className="course-card">
    <img
      src="../public/2606584_5920.jpg"
      alt={course.title}
      className="course-thumb"
    />
    <div className="course-info">
      <h4 className="course-title">{course.title}</h4>
      <p className="course-desc">{course.description}</p>
      <div className="course-meta">
        <span>👥 {course.enrolledCount} enrolled</span>
        <span>📅 {new Date(course.date).toLocaleDateString()}</span>
      </div>
      <div className="course-tags">
        {course.tags && course.tags[1]?.slice(0, 4).map((tag, idx) => (
          <span key={idx} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  </div>
);

const UserDashboard = ({ user, setUser, token }) => {
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

  const [showPrefModal, setShowPrefModal] = useState(false);

  useEffect(() => {
    if (user && (!user.preferences || user.preferences.length < 3)) {
      setShowPrefModal(true);
    }
  }, [user]);
  const { courses } = useCourseData();
  const { books } = useBooksData();
  const handleSavePreferences = async (prefs) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL_LOCAL}/api/users/preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user._id, preferences: prefs }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUser({ ...user, preferences: prefs });
        setShowPrefModal(false);
        alert("Preferences Saved Successfully");
      } else {
        alert(data.message || "Error saving preferences");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to save preferences.");
    }
  };

  return (
    <div className="dashboard-container">
      <Preferences
        isOpen={showPrefModal}
        onClose={() => setShowPrefModal(false)}
        onSave={handleSavePreferences}
      />

      <section className="dashboard-header">
        <div className="user-info">
          <h2>UserName : {username}</h2>
          <p>Email : {email}</p>
          <p>{stream}</p>
          <p>Member since: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <div className="user-preferences">
          <h3>Preferences</h3>
          <div className="tags">
            {preferences.map((pref, idx) => (
              <span key={idx} className="tag">{pref}</span>
            ))}
            <button className="edit-btn" onClick={() => setShowPrefModal(true)}>
              Edit
            </button>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h3 className="section-title">Courses Read</h3>
        <div className="dashboard-grid">
          {coursesRead.length ? (
            coursesRead.map(id => courses.find(c => c._id === id))
  .filter(Boolean)
  .map(course => <CourseCard key={course._id} course={course} />)
          ) : (
            <p className="empty-text">No courses read yet.</p>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h3 className="section-title">Courses Added</h3>
        <div className="dashboard-grid">
          {coursesAdded.length ? (
            coursesAdded.map(id => courses.find(c => c._id === id))
  .filter(Boolean)
  .map(course => <CourseCard key={course._id} course={course} />)
          )  : (
            <p className="empty-text">No courses added yet.</p>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h3 className="section-title">Books Read</h3>
        <div className="book-list">
  {booksRead.length ? (
    <div className="book-grid">
      {booksRead
        .map(id => books.find(b => b._id === id))
        .filter(Boolean)
        .map(book => (
          <BookCard key={book._id} book={book} />
        ))}
    </div>
  ) : (
    <p className="empty-text">No books read yet.</p>
  )}
</div>
      </section>

      <section className="dashboard-section">
        <h3 className="section-title">Books Added</h3>
        <div className="book-list">
  {booksRead.length ? (
    <div className="book-grid">
      {booksRead
        .map(id => books.find(b => b._id === id))
        .filter(Boolean)
        .map(book => (
          <BookCard key={book._id} book={book} />
        ))}
    </div>
  ) : (
    <p className="empty-text">No books read yet.</p>
  )}
</div>
      </section>
    </div>
  );
};

export default UserDashboard;
