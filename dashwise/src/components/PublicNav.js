import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/PublicNav.css';

function PublicNav() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://localhost:5000/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.email) setUser(data);
        })
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="global-navbar">
      <NavLink to="/" className="nav-logo" onClick={() => setMenuOpen(false)} end>
        <img src="/LOGO.png" alt="Logo" />
      </NavLink>

      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={() => setMenuOpen(false)}
        >
          About Us
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={() => setMenuOpen(false)}
        >
          Contact Us
        </NavLink>
        {user && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </NavLink>
        )}
      </div>

      <div className={`nav-user ${menuOpen ? 'open' : ''}`}>
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <div className="avatar">{user.email[0].toUpperCase()}</div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn-primary" onClick={() => setMenuOpen(false)}>
              Log In
            </NavLink>
            <NavLink to="/signup" className="btn-outline" onClick={() => setMenuOpen(false)}>
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default PublicNav;
