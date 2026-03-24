import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { storeUser } from "../services/authStorage";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await authAPI.login(form);
      storeUser(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="hero-copy">
              <span className="eyebrow">Sync Space</span>
              <h1>Bring your college project team into one focused workspace.</h1>
              <p>
                Manage deadlines, assign work, share files, and chat in real time without bouncing
                between separate tools.
              </p>
              <div className="hero-metrics">
                <div className="hero-metric">
                  <strong>Projects</strong>
                  <span>Shared workspaces for every team</span>
                </div>
                <div className="hero-metric">
                  <strong>Tasks</strong>
                  <span>Deadlines and owners always visible</span>
                </div>
                <div className="hero-metric">
                  <strong>Chat</strong>
                  <span>Fast updates without leaving the workspace</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 ms-lg-auto">
            <div className="card auth-card border-0">
              <div className="card-body p-4 p-lg-5">
                <div className="auth-badge">Student Collaboration Hub</div>
                <h2 className="fw-bold mb-4">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="student@example.com"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
                <p className="text-muted mt-4 mb-0">
                  New here? <Link to="/register">Create an account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
