import React, { useState } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ title, email }) {
  const avatarLetter = email?.charAt(0)?.toUpperCase() || "?";
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setShowMenu(!showMenu);
  const goToSettings = () => {
    setShowMenu(false);
    window.dispatchEvent(new CustomEvent("goToSettings"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-title">{title}</div>
      <div className="navbar-actions">
        <FiBell size={20} className="notification-icon" />
        <div className="avatar" onClick={handleMenuToggle}>
          {avatarLetter}
          {showMenu && (
            <div className="avatar-menu">
              <div onClick={goToSettings}>Settings</div>
              <div onClick={logout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
