import React, { useState } from "react";

function TaskForm({ members, projectId, onCreate, loading }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    deadline: ""
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreate({ ...form, projectId }, () =>
      setForm({ title: "", description: "", assignedTo: "", priority: "Medium", deadline: "" })
    );
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-3">Create Task</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Task Title</label>
            <input
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              placeholder="Prepare literature review"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add context, references, and expected output."
            />
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Assign To</label>
              <select
                name="assignedTo"
                className="form-select"
                value={form.assignedTo}
                onChange={handleChange}
                required
              >
                <option value="">Choose teammate</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Deadline</label>
              <input
                type="datetime-local"
                name="deadline"
                className="form-control"
                value={form.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-dark mt-4 w-100" disabled={loading}>
            {loading ? "Saving..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
