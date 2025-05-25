import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <p className="copyright">
          &copy; {new Date().getFullYear()} SmartBiz™. All rights reserved.
        </p>
        <nav className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          {/* <Link to="/privacy">Privacy Policy</Link>
          <Link to="/licensing">Licensing</Link> */}
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
