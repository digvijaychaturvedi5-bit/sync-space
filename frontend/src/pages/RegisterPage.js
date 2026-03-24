import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { storeUser } from "../services/authStorage";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const { data } = await authAPI.register(form);
      storeUser(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
              <span className="eyebrow">Build Together</span>
              <h1>Create a shared home for your final-year project team.</h1>
              <p>
                Organize milestones, coordinate responsibilities, and keep every deliverable visible.
              </p>
              <div className="hero-metrics">
                <div className="hero-metric">
                  <strong>Invite Teams</strong>
                  <span>Bring classmates into the same space in seconds</span>
                </div>
                <div className="hero-metric">
                  <strong>Track Progress</strong>
                  <span>Move tasks from pending to completed with clarity</span>
                </div>
                <div className="hero-metric">
                  <strong>Share Files</strong>
                  <span>Keep reports, slides, and resources in one place</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 ms-lg-auto">
            <div className="card auth-card border-0">
              <div className="card-body p-4 p-lg-5">
                <div className="auth-badge">Launch Your Workspace</div>
                <h2 className="fw-bold mb-4">Register</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Alex Johnson"
                      required
                    />
                  </div>
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
                      placeholder="Choose a secure password"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                  </button>
                </form>
                <p className="text-muted mt-4 mb-0">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
