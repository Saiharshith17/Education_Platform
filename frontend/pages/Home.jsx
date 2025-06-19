import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Preferences from "../components/Preferences";
import {useCourseData} from "../src/store/CourseContext";

import { useAuth } from "../src/store/auth"; // Example import

const Home = () => {
  const { user, setUser,token } = useAuth(); // Replace with your actual user context/hook
  const [showPrefModal, setShowPrefModal] = useState(false);
  const [recommendations,setRecommendations]=useState([]);
  const {courses,setCourses} = useCourseData();
  useEffect(() => {
    if (user && (!user.preferences || user.preferences.length < 3)) {
      setShowPrefModal(true);
    }
  }, [user]);
  
  useEffect(()=>{
    const fetchRecommendations=async()=>{
      const course_ids=[
        ...(user.coursesRead || []),
        ...(user.coursesAdded || []),
      ];
      const tags=user.preferences||[];
      try{
        const res=await fetch("http://127.0.0.1:8000/recommend",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify({course_ids,tags}),
        });
        if(!res.ok) return setRecommendations([]);
        if(res.ok){
          const data=await res.json();
          const recommendedIds=data.recommendations||[];
          const recommendedCourses=courses.filter(course=>{
            recommendedIds.includes(course._id);
          });
          setRecommendations(recommendedIds||[]);
        }
      }catch(error){
        console.log("Error fetching recommendations:", error);
        setRecommendations([]);
      }
    };
    fetchRecommendations();
  },[user,token,courses]);


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
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <RecommendedCard
                key={rec._id}
                title={rec.title}
                description={rec.description}
                // Add more fields as needed
              />
            ))
          ) : (
            <p>No recommendations yet. Add courses or set preferences!</p>
          )}
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