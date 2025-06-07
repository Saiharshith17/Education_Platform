// Home.jsx
import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="home-container">
      

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
