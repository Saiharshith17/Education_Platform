import React, { useState,useEffect } from "react";
import "./Dashboard.css";
import Preferences from "../components/Preferences";


const UserDashboard = ({ user, setUser,token }) => {
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

  
   // Replace with your actual user context/hook
    const [showPrefModal, setShowPrefModal] = useState(false);
  
    useEffect(() => {
      if (user && (!user.preferences || user.preferences.length < 3)) {
        setShowPrefModal(true);
      }
    }, [user]);
  
    const handleSavePreferences = async (prefs) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/preferences`, {
          method: "PUT",
          headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user._id, preferences: prefs }),
        });

        const data = await res.json(); // ✅ Parse the response

    if (res.ok) {
      console.log("Success:", data.message); // Optional log
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
      {/* Preferences Modal */}
      <Preferences
        isOpen={showPrefModal}
        onClose={() => setShowPrefModal(false)}
        onSave={handleSavePreferences}
      />

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
            <div
              className="edit"
              onClick={() => setShowPrefModal(true)}
              tabIndex={0}
              role="button"
            >
              Edit
            </div>
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
