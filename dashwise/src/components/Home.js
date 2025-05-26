import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-left">
          <h1 className="headline">
            Simplify Operations. Strengthen Relationships. Grow Smarter.
          </h1>
          <p className="subtext">
            Still managing your business with scattered WhatsApp chats,
            notebooks, or spreadsheets?
          </p>
          <p className="pitch">
            <strong>DashWise</strong> is your all-in-one business assistant
            designed for salons, tutors, consultants, and other service
            professionals seeking a <strong>streamlined, affordable</strong> way
            to stay organized, track finances, and deliver a premium client
            experience.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Log In
            </button>
            <button className="btn-outline" onClick={() => navigate("/signup")}>
              Get Started Free
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img src="/hero.jpeg" alt="DashWise Preview" className="hero-image" />
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features">
        <div className="feature-section">
          <h2 className="feature-heading">Stay Organized</h2>
          <div className="features-grid">
            <div className="feature-item">
              <img src="/appointments.png" alt="appointment icon" />
              <p>Organize and track appointments without the back-and-forth</p>
            </div>
            <div className="feature-item">
              <img src="/management.png" alt="CRM Icon" />
              <p>Manage client relationships with a built-in CRM</p>
            </div>
          </div>
        </div>

        <div className="feature-section">
          <h2 className="feature-heading">Stay Ahead</h2>
          <div className="features-grid">
            <div className="feature-item">
              <img src="/progress.png" alt="progress icon" />

              <p>Monitor daily, weekly, and monthly income in real-time</p>
            </div>
            <div className="feature-item">
              <img src="/organised.png" alt="organised icon"  />

              <p>
                Export polished PDF or CSV reports for tax time or stakeholders
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
