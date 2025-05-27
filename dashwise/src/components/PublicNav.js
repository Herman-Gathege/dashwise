import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // ensure Bootstrap is imported


// import '../styles/PublicNav.css';

function PublicNav() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/me", {
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
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand" end>
          <img src="/LOGO.png" alt="Logo" height="40" />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  "nav-link" +
                  (isActive
                    ? " active fw-bold border-bottom border-primary"
                    : "")
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  "nav-link" +
                  (isActive
                    ? " active fw-bold border-bottom border-primary"
                    : "")
                }
              >
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  "nav-link" +
                  (isActive
                    ? " active fw-bold border-bottom border-primary"
                    : "")
                }
              >
                Contact Us
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    "nav-link" +
                    (isActive
                      ? " active fw-bold border-bottom border-primary"
                      : "")
                  }
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="me-2 text-primary fw-semibold">
                  {user.email}
                </span>
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: 36, height: 36, fontWeight: "600" }}
                >
                  {user.email[0].toUpperCase()}
                </div>
                <button
                  className="btn btn-link text-primary fw-semibold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="btn btn-primary"
                  style={{ backgroundColor: "#4299e1", borderColor: "#4299e1",  textAlign: "center"  }}
                >
                  Log In
                </NavLink>

                <NavLink to="/signup" className="btn btn-outline-primary">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNav;
