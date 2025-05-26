import React from 'react';
import '../styles/About.css'; // optional for styling

function About() {
  return (
    <section className="about-page">
      <div className="container">
        <h1 className="about-title">About SmartBiz</h1>
        
        <p className="about-intro">
          At <strong>DashWise</strong>, we empower local service professionals by providing an all-in-one platform
          designed to simplify your daily operations and help your business thrive.
        </p>

        <p className="about-details">
          From managing appointments seamlessly to tracking your income in real time, and building lasting
          relationships with your customers, DashWise is crafted with your unique needs in mind.
        </p>

        <p className="about-target">
          Whether you're running a salon, tutoring, consulting, or offering any local service, DashWise
          offers an affordable and intuitive solution tailored to boost your productivity and grow your business.
        </p>

        <p className="about-cta">
          Join thousands of professionals already using DashWise to take control of their business      simple, smart, and effective.
        </p>
      </div>
    </section>
  );
}

export default About;
