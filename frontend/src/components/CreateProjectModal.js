import React, { useState } from "react";

function CreateProjectModal({ onCreate, loading }) {
  const [form, setForm] = useState({ title: "", description: "" });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreate(form, () => setForm({ title: "", description: "" }));
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-3">Create a Project Space</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Project Title</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="AI Research Team"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the project goals, timeline, and deliverables."
            />
          </div>
          <button type="submit" className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
