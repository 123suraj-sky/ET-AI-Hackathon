import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);
      const token = response.data.token;
      const user = response.data.user;

      login(token, user);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <div className="login-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 7v6c0 5 4 8.5 9 9 5-.5 9-4 9-9V7l-9-5z"
                stroke="#2563eb"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to continue to your account</p>
        </div>

        {error && (
          <div className="login-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#fca5a5" strokeWidth="1.6" />
              <path d="M12 8v5" stroke="#fca5a5" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="16" r="0.9" fill="#fca5a5" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16v12H4V6z"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <path d="M4 7l8 6 8-6" stroke="#64748b" strokeWidth="1.5" />
            </svg>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10" width="14" height="9" rx="2" stroke="#64748b" strokeWidth="1.5" />
              <path d="M8 10V7a4 4 0 018 0v3" stroke="#64748b" strokeWidth="1.5" />
            </svg>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3l18 18" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                  <path
                    d="M10.6 10.6a2 2 0 002.8 2.8"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6.5 6.7C4.6 8 3.2 9.8 2.5 12c1.4 4 5 7 9.5 7 1.7 0 3.3-.4 4.6-1.2M17.9 17.1C19.6 15.8 21 14 21.5 12c-1.4-4-5-7-9.5-7-.9 0-1.8.1-2.6.4"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.5 12c1.4-4 5-7 9.5-7s8.1 3 9.5 7c-1.4 4-5 7-9.5 7s-8.1-3-9.5-7z"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="12" r="3" stroke="#64748b" strokeWidth="1.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? <span className="spinner" /> : "Sign in"}
        </button>

        <p className="signup-text">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;