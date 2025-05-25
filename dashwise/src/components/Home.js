import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-hero">
      <div className="hero-left">
        <h1 className="headline">SmartBiz</h1>
        <p className="subtext">
          Are you still juggling WhatsApp messages, notebooks, or spreadsheets to run your business?
        </p>
        <p className="pitch">
          SmartBiz is your personal business assistant — built for salons, tutors, consultants,
          and other local service pros who need a **simple, affordable** way to stay organized,
          track money, and impress clients.
        </p>
        <ul className="features">
          <li>📅 Schedule and track appointments without the chaos</li>
          <li>💰 See your daily, weekly, and monthly income at a glance</li>
          <li>👥 Build lasting relationships with a built-in customer CRM</li>
          <li>📊 Export PDF/CSV reports for tax time or investors</li>
        </ul>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Log In
          </button>
          <button className="btn-outline" onClick={() => navigate('/signup')}>
            Get Started Free
          </button>
        </div>
      </div>

      <div className="hero-right">
        <img src="/hero.jpeg" alt="SmartBizDash Preview" className="hero-image" />
      </div>
    </div>
  );
}

export default Home;
