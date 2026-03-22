import React from "react";

const statusClasses = {
  Pending: "warning",
  "In Progress": "primary",
  Completed: "success",
  Overdue: "danger"
};

function TaskList({ tasks, onStatusChange }) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Task Board</h4>
          <span className="text-muted small">{tasks.length} tasks</span>
        </div>
        <div className="d-grid gap-3">
          {tasks.length === 0 && <p className="text-muted mb-0">No tasks yet. Add the first one above.</p>}
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-item p-3 rounded-4 ${
                task.alerts?.isOverdue ? "task-item-overdue" : task.alerts?.isUrgent ? "task-item-urgent" : ""
              }`}
            >
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h5 className="mb-0">{task.title}</h5>
                    <span className={`badge text-bg-${statusClasses[task.effectiveStatus || task.status]}`}>
                      {task.effectiveStatus || task.status}
                    </span>
                    <span className={`badge priority-badge priority-badge-${(task.priority || "Medium").toLowerCase()}`}>
                      {task.priority || "Medium"} Priority
                    </span>
                  </div>
                  <p className="text-muted mt-2 mb-2">{task.description || "No extra details provided."}</p>
                  <div className="small text-muted">
                    Assigned to {task.assignedTo?.name} | Due {new Date(task.deadline).toLocaleString()}
                  </div>
                  {task.alerts?.isUrgent && <div className="small task-meta-urgent mt-2">Due within the next 24 hours.</div>}
                  {task.alerts?.isOverdue && <div className="small task-meta-overdue mt-2">This task is overdue.</div>}
                  {task.alerts?.shouldSuggestHighPriority && task.priority !== "High" && (
                    <div className="small text-danger mt-2">Suggested priority: High</div>
                  )}
                </div>
                <select
                  className="form-select w-auto"
                  value={task.status}
                  onChange={(event) => onStatusChange(task, event.target.value)}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskList;
