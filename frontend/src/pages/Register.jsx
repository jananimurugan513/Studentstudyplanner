import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Register = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", credentials);
      navigate("/login");
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
          Start managing your study schedule efficiently
        </p>

        <form onSubmit={handleClick} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              id="name"
              className="input-base"
              placeholder="John Doe"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Student ID (Optional)</label>
            <input
              type="text"
              id="studentId"
              className="input-base"
              placeholder="123456"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              id="email"
              className="input-base"
              placeholder="student@example.com"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              id="password"
              className="input-base"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
            Register
          </button>
          {error && <span className="error-text">Something went wrong!</span>}
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--brand-primary)", fontWeight: "600" }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
