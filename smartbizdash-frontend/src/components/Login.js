import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.error || 'Login failed.');
      }
    } catch (err) {
      setLoading(false);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-12 col-sm-8 col-md-6 col-lg-4">
        <div className="card shadow-sm p-4 border-primary">
          <h3 className="text-center mb-4 text-primary">Welcome Back</h3>

          <div className="form-group mb-3">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary w-100 mb-3"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="text-center mt-3">
            <h6 className="mb-2">Don't have an account?</h6>
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => navigate('/signup')}
              disabled={loading}
            >
              {loading ? 'Redirecting...' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
