import React from "react";

function EditorPresenceList({ activeUsers }) {
  return (
    <div className="card border-0 shadow-sm code-sidebar-card">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Active In Editor</h4>
          <span className="editor-status-pill">{activeUsers.length}</span>
        </div>
        <div className="presence-list">
          {activeUsers.length === 0 && (
            <div className="member-row p-3">
              <div className="fw-semibold">Just you right now</div>
              <div className="small text-muted">Teammates will appear here as soon as they join.</div>
            </div>
          )}

          {activeUsers.map((user) => (
            <div key={`${user._id}-${user.email}`} className="member-row p-3">
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div>
                  <div className="fw-semibold">{user.name}</div>
                  <div className="small text-muted">{user.email}</div>
                </div>
                <span className="presence-chip">Live</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditorPresenceList;
