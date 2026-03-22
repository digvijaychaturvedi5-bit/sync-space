import React from "react";
import { Link } from "react-router-dom";

function ProjectCard({ currentUser, onRemove, project, removing }) {
  const isOwner = project.owner?._id === currentUser?._id;
  const actionLabel = isOwner ? "Delete Project" : "Remove From Workspace";

  return (
    <div className="col-md-6 col-xl-4">
      <div className="card project-card h-100 border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <p className="text-uppercase small text-muted mb-1">Workspace</p>
              <h5 className="fw-bold mb-0">{project.title}</h5>
            </div>
            <span className="badge text-bg-light">Code: {project.inviteCode}</span>
          </div>
          <p className="text-muted">{project.description || "No description added yet."}</p>
          <div className="small text-muted mb-3">
            <div>Owner: {project.owner?.name}</div>
            <div>Members: {project.members?.length || 0}</div>
          </div>
          <Link className="btn btn-dark w-100" to={`/projects/${project._id}`}>
            Open Project
          </Link>
          <button
            className="btn btn-outline-danger w-100 mt-2"
            disabled={removing}
            onClick={() => onRemove(project)}
            type="button"
          >
            {removing ? "Processing..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
