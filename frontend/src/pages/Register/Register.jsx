import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authApi";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await registerUser(formData);
      setMessage(response.data.message);
      setIsError(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setMessage("Registration failed");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <div className="register-header">
          <div className="register-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.2" stroke="#2563eb" strokeWidth="1.6" />
              <path
                d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"
                stroke="#2563eb"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2>Create account</h2>
          <p className="register-subtitle">Join us — it only takes a minute</p>
        </div>

        {message && (
          <div className={`register-message ${isError ? "is-error" : "is-success"}`} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              {isError ? (
                <>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="0.9" fill="currentColor" />
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}
            </svg>
            <span>{message}</span>
          </div>
        )}

        <div className="input-group">
          <label htmlFor="name">Full name</label>
          <div className="input-wrapper">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.2" stroke="#64748b" strokeWidth="1.5" />
              <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              id="name"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16v12H4V6z" stroke="#64748b" strokeWidth="1.5" />
              <path d="M4 7l8 6 8-6" stroke="#64748b" strokeWidth="1.5" />
            </svg>
            <input
              id="email"
              name="email"
              type="email"
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
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
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
                  <path d="M10.6 10.6a2 2 0 002.8 2.8" stroke="#64748b" strokeWidth="1.5" />
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

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? <span className="spinner" /> : "Create account"}
        </button>

        <p className="login-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;