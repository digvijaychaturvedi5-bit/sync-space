import React, { useState } from "react";

function JoinProjectCard({ onJoin, loading }) {
  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onJoin(inviteCode, () => setInviteCode(""));
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-3">Join with Invite Code</h4>
        <p className="text-muted">
          Ask a teammate for the workspace code and join your project instantly.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Invite Code</label>
            <input
              className="form-control"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
              placeholder="ABC123"
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-dark w-100" disabled={loading}>
            {loading ? "Joining..." : "Join Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinProjectCard;
