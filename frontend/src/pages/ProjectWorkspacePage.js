import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fileAPI, messageAPI, projectAPI, taskAPI } from "../services/api";
import ChatBox from "../components/ChatBox";

const DEFAULT_ALERT_SUMMARY = {
  overdueCount: 0,
  upcomingCount: 0,
  suggestionCount: 0
};

function ProjectWorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("syncSpaceUser"));
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [alertSummary, setAlertSummary] = useState(DEFAULT_ALERT_SUMMARY);
  const [alertPreviewError, setAlertPreviewError] = useState("");
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(false);

  const loadWorkspace = useCallback(async () => {
    try {
      const [projectRes, taskRes, fileRes] = await Promise.all([
        projectAPI.getById(id),
        taskAPI.getByProject(id),
        fileAPI.getByProject(id)
      ]);
      setProject(projectRes.data);
      setTasks(taskRes.data);
      setFiles(fileRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load project workspace");
    }
  }, [id]);

  const loadMessages = useCallback(async () => {
    try {
      const { data } = await messageAPI.getByProject(id);
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load messages");
    }
  }, [id]);

  const loadAlertSummary = useCallback(async () => {
    try {
      const { data } = await taskAPI.getAlerts(id);
      setAlertSummary(data.summary || DEFAULT_ALERT_SUMMARY);
      setAlertPreviewError("");
    } catch (err) {
      // Keep the workspace usable even if the alert summary call is temporarily unavailable.
      setAlertSummary(DEFAULT_ALERT_SUMMARY);
      setAlertPreviewError(err.response?.data?.message || "Smart alerts are temporarily unavailable");
    }
  }, [id]);

  useEffect(() => {
    loadWorkspace();
    loadAlertSummary();
  }, [loadWorkspace, loadAlertSummary]);

  if (!project) {
    return (
      <div className="page-shell">
        <div className="container py-5">{error ? <div className="alert alert-danger">{error}</div> : "Loading..."}</div>
      </div>
    );
  }

  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const totalPriorityAlerts = alertSummary.overdueCount + alertSummary.upcomingCount;
  const isOwner = project.owner?._id === currentUser?._id;

  const handleRemoveProject = async () => {
    const confirmed = window.confirm(
      isOwner
        ? `Delete "${project.title}" for everyone? This will permanently remove its tasks, files, chat, and code session.`
        : `Remove "${project.title}" from your workspace?`
    );
    if (!confirmed) {
      return;
    }

    try {
      setRemoving(true);
      if (isOwner) {
        await projectAPI.deleteProject(id);
      } else {
        await projectAPI.leave(id);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update project workspace");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="container py-4 py-lg-5">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="workspace-header mb-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <span className="eyebrow">Project Workspace</span>
              <h1 className="fw-bold mb-2">{project.title}</h1>
              <p className="text-muted mb-3">{project.description || "No description has been added yet."}</p>
              <div className="workspace-stat-strip">
                <div className="workspace-stat-pill">
                  <span>Invite Code</span>
                  <strong>{project.inviteCode}</strong>
                </div>
                <div className="workspace-stat-pill">
                  <span>Members</span>
                  <strong>{project.members?.length}</strong>
                </div>
                <div className="workspace-stat-pill">
                  <span>Completed</span>
                  <strong>{completedTasks}</strong>
                </div>
                <div className="workspace-stat-pill">
                  <span>Files</span>
                  <strong>{files.length}</strong>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="workspace-alert-card mb-3">
                <div className="d-flex flex-column gap-3">
                  <div>
                    <div className="workspace-alert-eyebrow">Smart Alerts</div>
                    <h5 className="fw-bold mb-1">
                      {alertPreviewError
                        ? "Deadline summary unavailable"
                        : `${alertSummary.overdueCount} overdue, ${alertSummary.upcomingCount} due soon`}
                    </h5>
                    <p className="small text-muted mb-0">
                      Review urgent deadlines and high-priority suggestions from one place.
                    </p>
                  </div>
                  <Link className="btn btn-sunset" to={`/projects/${id}/tasks`}>
                    Review Smart Alerts
                  </Link>
                  <div className="workspace-alert-chip-row">
                    <span className="workspace-alert-chip workspace-alert-chip-danger">
                      Overdue {alertSummary.overdueCount}
                    </span>
                    <span className="workspace-alert-chip workspace-alert-chip-warn">
                      Due Soon {alertSummary.upcomingCount}
                    </span>
                    <span className="workspace-alert-chip workspace-alert-chip-calm">
                      Suggestions {alertSummary.suggestionCount}
                    </span>
                    <span className="workspace-alert-chip">
                      Total Flags {totalPriorityAlerts}
                    </span>
                  </div>
                </div>
              </div>
              <div className="workspace-links d-grid gap-2">
                <Link className="btn btn-dark" to={`/projects/${id}/tasks`}>
                  Open Task Board
                </Link>
                <Link className="btn btn-outline-dark" to={`/projects/${id}/code`}>
                  Open Code Editor
                </Link>
                <Link className="btn btn-outline-dark" to={`/projects/${id}/files`}>
                  Open File Manager
                </Link>
                <Link className="btn btn-outline-dark" to={`/projects/${id}/chat`}>
                  Open Chat Section
                </Link>
                <Link className="btn btn-outline-dark" to={`/projects/${id}/contributions`}>
                  View Contributions
                </Link>
                <button className="btn btn-outline-danger" disabled={removing} onClick={handleRemoveProject} type="button">
                  {removing ? "Processing..." : isOwner ? "Delete Project" : "Remove From Workspace"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Team Members</h4>
                <div className="d-grid gap-3">
                  {project.members.map((member) => (
                    <div key={member._id} className="member-row p-3">
                      <div className="fw-semibold">{member.name}</div>
                      <div className="small text-muted">{member.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <ChatBox
              projectId={id}
              currentUser={currentUser}
              messages={messages}
              setMessages={setMessages}
              loadMessages={loadMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectWorkspacePage;
