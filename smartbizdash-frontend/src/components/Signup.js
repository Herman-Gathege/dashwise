import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Please enter both email and password.");
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
        setError(data.error || 'Signup failed.');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-12 col-sm-8 col-md-6 col-lg-4">
        <div className="card shadow-sm p-4">
          <h3 className="text-center mb-4">Create Account</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSignup}>
            <div className="form-group mb-3">
              <label htmlFor="signupEmail">Email</label>
              <input
                id="signupEmail"
                name="email"
                className="form-control"
                placeholder="Enter email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="signupPassword">Password</label>
              <input
                id="signupPassword"
                name="password"
                className="form-control"
                placeholder="Enter password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-3">
            <h6 className="mb-2">Already have an account?</h6>
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              {loading ? 'Redirecting...' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
