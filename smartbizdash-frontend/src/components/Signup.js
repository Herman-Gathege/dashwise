import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert('Signup successful! Please log in.');
        navigate('/login');
      } else {
        alert(data.error || 'Signup failed.');
      }
    } catch (error) {
      setLoading(false);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-12 col-sm-8 col-md-6 col-lg-4">
        <div className="card shadow-sm p-4">
          <h3 className="text-center mb-4">Create Account</h3>

          <div className="form-group mb-3">
            <label>Email</label>
            <input
              className="form-control"
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label>Password</label>
            <input
              className="form-control"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <div className="text-center mt-3">
            <h6 className="mb-2">Already have an account?</h6>
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              {loading ? 'Redirecting...' : 'login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
