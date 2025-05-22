import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1>Welcome to SmartBizDash</h1>
      <p className="lead">Manage your appointments, track revenue, and serve clients better — all in one dashboard.</p>
      <div className="mt-4">
        <button className="btn btn-primary mx-2" onClick={() => navigate('/login')}>Log In</button>
        <button className="btn btn-outline-primary mx-2" onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
}

export default Home;
