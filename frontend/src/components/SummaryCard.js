import React from "react";

function SummaryCard({ title, value, subtitle }) {
  return (
    <div className="col-sm-6 col-xl-3">
      <div className="card summary-card border-0 h-100">
        <div className="card-body">
          <p className="text-uppercase small text-muted mb-2">{title}</p>
          <h3 className="fw-bold mb-1">{value}</h3>
          <p className="text-muted mb-0">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
