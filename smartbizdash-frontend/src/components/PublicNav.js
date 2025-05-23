import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/PublicNav.css'; // Optional styles

function PublicNav() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Fetch minimal user info
      fetch('http://localhost:5000/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.email) {
            setUser(data);
          }
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
  };

  return (
    <nav className="global-navbar">
      <Link to="/" className="nav-logo">
        <img src="/logodash.png" alt="Logo" />
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        {user && <Link to="/dashboard">Dashboard</Link>}
      </div>

      <div className="nav-user">
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
            <Link to="/login" className="btn-primary">Log In</Link>
            <Link to="/signup" className="btn-outline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default PublicNav;
