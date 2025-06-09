// LeftBar.jsx
import React from "react";
import "./LeftSidebar.css";
import { useAuth } from "../src/store/auth";


const LeftSidebar = () => {
  
   const {user}=useAuth();
   console.log(user);
  return (
    <div className="leftbar">
      <div className="profile">
        <img src={user?.avatar || "/default-avatar.png"} alt="Avatar" className="avatar" />
        <h3>{user?.username || "Guest"}</h3>
        <p>{user?.email}</p>
      </div>

      <div className="preferences">
        <h4>Preferences</h4>
        <ul>
          {user?.preferences?.map((pref, i) => (
            <li key={i}>{pref}</li>
          ))}
        </ul>
      </div>

      <div className="nav-links">
        <a href="/dashboard">Dashboard</a>
        <a href="/my-courses">My Courses</a>
        <a href="/settings">Settings</a>
      </div>
    </div>
  );
};

export default LeftSidebar;




LeftSidebar