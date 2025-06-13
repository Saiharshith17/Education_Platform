import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="book-flat">
        <div className="cover"></div>
        <div className="page-flip"></div>
        <div className="page-flip"></div>
        <div className="page-flip"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading;
