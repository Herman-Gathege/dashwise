import React from "react";
import { FiBell } from "react-icons/fi";
import "../styles/Navbar.css"; // Create this file for styles

function Navbar({ title, email }) {
  const avatarLetter = email?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="navbar">
      <div className="navbar-title">{title}</div>
      <div className="navbar-actions">
        <FiBell size={20} className="notification-icon" />
        <div className="avatar">{avatarLetter}</div>
      </div>
    </div>
  );
}

export default Navbar;
