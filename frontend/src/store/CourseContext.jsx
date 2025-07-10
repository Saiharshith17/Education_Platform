// src/store/courseContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CourseContext = createContext();

export const useCourseData = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses`);
        const data = await res.json();
        setCourses(data.courses);
        
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };

    fetchCourses();
  }, []); // fetch once on app load

  return (
    <CourseContext.Provider value={{ courses, setCourses }}>
      {children}
    </CourseContext.Provider>
  );
};
