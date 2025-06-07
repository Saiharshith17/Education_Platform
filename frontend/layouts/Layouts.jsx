import React from "react";
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";  // your left sidebar component
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="layout-body">
        <aside className="left-sidebar">
          <LeftSidebar />
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
