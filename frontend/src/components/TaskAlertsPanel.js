import React from "react";

function TaskAlertsPanel({ alerts }) {
  const summary = alerts?.summary || {
    overdueCount: 0,
    upcomingCount: 0,
    suggestionCount: 0
  };

  return (
    <div className="task-alerts-panel mb-4">
      <div className="row g-3">
        <div className="col-md-4">
          <div className="alert-card alert-card-urgent p-3 h-100">
            <div className="small text-uppercase fw-bold mb-2">Due Soon</div>
            <div className="h4 fw-bold mb-1">{summary.upcomingCount}</div>
            <div className="small mb-0">Tasks due within the next 24 hours.</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="alert-card alert-card-overdue p-3 h-100">
            <div className="small text-uppercase fw-bold mb-2">Overdue</div>
            <div className="h4 fw-bold mb-1">{summary.overdueCount}</div>
            <div className="small mb-0">Items that have passed their deadline.</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="alert-card alert-card-suggestion p-3 h-100">
            <div className="small text-uppercase fw-bold mb-2">Priority Suggestions</div>
            <div className="h4 fw-bold mb-1">{summary.suggestionCount}</div>
            <div className="small mb-0">Tasks that should probably move to High priority.</div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Immediate Alerts</h5>
              <div className="d-grid gap-3">
                {alerts?.upcomingTasks?.length ? (
                  alerts.upcomingTasks.slice(0, 3).map((task) => (
                    <div key={task._id} className="member-row p-3">
                      <div className="fw-semibold">{task.title}</div>
                      <div className="small text-muted">
                        Due {new Date(task.deadline).toLocaleString()} | Assigned to {task.assignedTo?.name}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mb-0">No tasks are due within the next 24 hours.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Priority Suggestions</h5>
              <div className="d-grid gap-3">
                {alerts?.prioritySuggestions?.length ? (
                  alerts.prioritySuggestions.slice(0, 3).map((task) => (
                    <div key={task._id} className="member-row p-3">
                      <div className="fw-semibold">{task.title}</div>
                      <div className="small text-muted">{task.recommendation}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mb-0">Priority suggestions will appear when deadlines get tight.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAlertsPanel;
