import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Preferences from "../components/Preferences";
import {useCourseData} from "../src/store/CourseContext";
import { useBooksData } from "../src/store/booksContext.jsx";
import { useAuth } from "../src/store/auth"; // Example import
import ExploreBooks from "../components/ExploreBooks.jsx";
import FooterSection from "../components/FooterSection.jsx"; 


const Home = () => {
  const POPULAR_QUIZZES = [
  "Artificial Intelligence",
  "Frontend Development",
  "Backend Development",
  "DSA",
];
  const { user, setUser,token } = useAuth(); // Replace with your actual user context/hook
  const [showPrefModal, setShowPrefModal] = useState(false);
  const [recommendations,setRecommendations]=useState([]);
  const {courses,setCourses} = useCourseData();
  const { books } = useBooksData(); 
  const [cardWidth, setCardWidth] = useState(282); // default
  const [loading, setLoading] = useState(true);
  

useEffect(() => {
  const updateCardWidth = () => {
    const w = window.innerWidth;

    if (w >= 1440) setCardWidth(282);
    else if (w >= 1024) setCardWidth(355);
    else if (w >= 768) setCardWidth(357);
    else if (w >= 425) setCardWidth(312);
    else if (w >= 375) setCardWidth(277);
    else setCardWidth(238); // for <= 325
  };

  updateCardWidth();
  window.addEventListener("resize", updateCardWidth);
  return () => window.removeEventListener("resize", updateCardWidth);
}, []);

  useEffect(() => {
    if (user && (!user.preferences || user.preferences.length < 3)) {
      setShowPrefModal(true);
    }
  }, [user]);
  
  
  useEffect(()=>{
    const fetchRecommendations=async()=>{
     setLoading(true);

    const course_ids = [
      ...(user.coursesRead || []),
      ...(user.coursesAdded || []),
    ];

    const rawTags = user.preferences || [];

    // Mapping preferences to expected backend-friendly format
    const tagMap = {
      "Programming": "programming",
      "Data Structures": "dsa",
      "Frontend Development": "frontend",
      "Backend Development": "backend",
      "Full Stack Development": "full stack",
      "DevOps": "devops",
      "Machine Learning": "machine learning",
      "Computer Science": "fundamentals of computers"
    };

    const tags = rawTags
      .map(tag => tagMap[tag] || tag.toLowerCase());

    console.log("Request body:", { course_ids, tags });
      try{
        const res=await fetch("https://recommendations-naw0.onrender.com/recommend",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            
          },
          body:JSON.stringify({course_ids,tags}),
          
        });
        if(!res.ok) return setRecommendations([]);
        if(res.ok){
          const data=await res.json();
          const recommendedIds=data.recommendations||[];
          console.log("Recommended IDs:", recommendedIds);
          console.log("Available courses:", courses);
          const recommendedCourses=courses.filter(course=>
            recommendedIds.includes(course._id)
          );
          setRecommendations(recommendedCourses);
          setLoading(false);
          console.log("Recommendations fetched:", recommendedCourses);
        }
      }catch(error){
        console.log("Error fetching recommendations:", error);
        setRecommendations([]);
      }
    };
    fetchRecommendations();
  },[user,token,courses]);


const [startIdx, setStartIdx] = useState(0);
const visibleCount = 4;
const total = recommendations.length;

const handlePrev = () => setStartIdx(idx => Math.max(0, idx - 1));
const handleNext = () => setStartIdx(idx => Math.min(total - visibleCount, idx + 1));

  const handleSavePreferences = async (prefs) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/preferences`, {
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
        <div className="h3">Recommended Courses <span className="roll">for You</span></div>
          <p className="recommend-info">
    Recommendations are personalized based on your preferences and the courses you’ve added to your cart.
  </p>
        
  <div className="recommend-carousel-controls">
    <button onClick={handlePrev} disabled={startIdx === 0} className="carousel-btn">‹</button>
    <div className="recommend-carousel-viewport">
      <div
        className="recommend-grid sliding"
        style={{
        transform: `translateX(-${startIdx * cardWidth}px)`
      }}>
      <div className="recommend-grid">
  {loading ? (
  <p className="loading-text">Loading recommendations...</p>
) : recommendations.length > 0 ? (
    recommendations.map((rec) => (
      <Link
        key={rec._id}
        to={`/courses/${rec._id}`}
        state={{ course: rec }}
        className="course-card-link"
      >
        <RecommendedCard
          title={rec.title}
          description={rec.description}
          // ...other props
        />
      </Link>
    ))

    
  ) : (
    <p>No recommendations yet. Add courses or set preferences!</p>
  )}
</div>
      </div>
    </div>
    <button onClick={handleNext} disabled={startIdx + visibleCount >= total} className="carousel-btn">›</button>
  </div>
      </section>
  
<ExploreBooks books={books} />

     <section className="popular-quizzes">
  <div className="h3">Popular Quizzes</div>
  <div className="qui-grid">
    {POPULAR_QUIZZES.map((quizTopic) => (
      <Link
        key={quizTopic}
        to={`/quizzes?topic=${encodeURIComponent(quizTopic)}`}
        className="qui-card-link"
      >
        <div className="qui-card">
          <img src="\0b4a713f-6183-45f8-96db-327822832727.jpg" alt={quizTopic} className="qui-icon" />
          <h5>{quizTopic}</h5>
        </div>
      </Link>
    ))}
  </div>
</section>


      <section className="top-courses">
  <div className="h3">Top Enrolled Courses</div>
  <div className="top-courses-grid">
  {courses
    .slice()
    .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
    .slice(0, 4)
    .map((course) => (
      <Link
        key={course._id}
        to={`/courses/${course._id}`}
        state={{ course }}
        className="course-card-link"
      >
        <div className="top-course-card">
          <img src={course.image || "/2606584_5920.jpg"} alt={course.title} className="top-course-image" />
          <h5>{course.title}</h5>
          <p className="enroll-count">
            <span role="img" aria-label="students">👥</span> {course.enrolledCount || 0} enrolled
          </p>
        </div>
      </Link>
    ))}
</div>
</section>


    
      {/* Footer */}
      <FooterSection/>
      {/* Top Enrolled Courses Section */}

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
    <img src="/2606584_5920.jpg" alt={title} className="recommend-image" />
    <h5>{title}</h5>
    <div className="arrow-shaft"></div>
<div className="arrow-head"></div>
    
  </div>
  
  
);

export default Home;