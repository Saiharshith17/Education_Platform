import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Preferences from "../components/Preferences";


// You should get user and setUser from context or props
// For demo, you can replace with your actual user management
import { useAuth } from "../src/store/auth"; // Example import

const Home = () => {
  const { user, setUser,token } = useAuth(); // Replace with your actual user context/hook
  const [showPrefModal, setShowPrefModal] = useState(false);

  useEffect(() => {
    if (user && (!user.preferences || user.preferences.length < 3)) {
      setShowPrefModal(true);
    }
  }, [user]);

  const handleSavePreferences = async (prefs) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id, preferences: prefs }),
      });
      if (res.ok) {
        setUser({ ...user, preferences: prefs });
        setShowPrefModal(false);
      }
    } catch (err) {
      alert("Failed to save preferences.");
    }
  };

  return (
    <div className="home-container">
      {/* Preferences Modal */}
      <Preferences
        isOpen={showPrefModal}
        onClose={() => setShowPrefModal(false)}
        onSave={handleSavePreferences}
      />

      {/* Features */}
      <section className="features">
        <FeatureCard title="Courses" link="/courses" />
        <FeatureCard title="Books" link="/books" />
        <FeatureCard title="Quizzes" link="/quizzes" />
        <FeatureCard title="Chatbot" link="/chatbot" />
      </section>

      {/* Recommended Section */}
      <section className="recommended">
        <h3>Recommended for You</h3>
        <div className="recommend-grid">
          <RecommendedCard title="Intro to DSA" />
          <RecommendedCard title="Mastering JavaScript" />
          <RecommendedCard title="Top 10 Coding Books" />
          <RecommendedCard title="Intro to DSA" />
          <RecommendedCard title="Mastering JavaScript" />
          <RecommendedCard title="Top 10 Coding Books" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} EduPlatform. All rights reserved.
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, link }) => (
  <Link to={link} className="feature-card">
    <div className="feature-icon">📘</div>
    <h4>{title}</h4>
  </Link>
);

const RecommendedCard = ({ title }) => (
  <div className="recommend-card">
    <h5>{title}</h5>
    <p>Explore this curated resource for better learning.</p>
  </div>
);

export default Home;