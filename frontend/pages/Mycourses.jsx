import React from "react";
import "./Mycourses.css";
import Loading from "../components/Loading.jsx";
import { useCourseData } from "../src/store/CourseContext"; // Correct usage

const Mycourses = ({ user }) => {
  const { courses } = useCourseData(); // Now getting the actual data
  console.log("user from mycourses:", user);
  console.log(`courses from mycourses: ${courses}`);
  if (!user || !courses?.length) return <div><Loading /></div>;

  const readIds = user.coursesRead || [];
  const addedIds = user.coursesAdded || [];

  const coursesRead = courses.filter(course => readIds.includes(course._id));
  const coursesAdded = courses.filter(course => addedIds.includes(course._id));

  return (
    <div className="courses-section">
      <div className="courses-half">
        <h2>Courses Read</h2>
        <div className="courses-list">
          {coursesRead.map(course => (
            <div className="course-card" key={course._id}>
              <h4>{course.title}</h4>
              <p>{course.description?.slice(0, 80)}...</p>
            </div>
          ))}
        </div>
      </div>

      <div className="courses-half">
        <h2>Courses Added</h2>
        <div className="courses-list">
          {coursesAdded.map(course => (
            <div className="course-card" key={course._id}>
              <h4>{course.title}</h4>
              <p>{course.description?.slice(0, 80)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mycourses;
