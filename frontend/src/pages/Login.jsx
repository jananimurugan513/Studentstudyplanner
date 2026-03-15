import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Auth.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { dispatch, isFetching, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="text-muted" style={{ marginBottom: "2rem" }}>
          Login to manage your study schedule
        </p>

        <form onSubmit={handleClick} className="auth-form">
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

          <button disabled={isFetching} type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
            {isFetching ? "Loading..." : "Login"}
          </button>
          {error && <span className="error-text">Wrong Credentials!</span>}
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--brand-primary)", fontWeight: "600" }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
