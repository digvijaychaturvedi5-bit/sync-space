import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import TaskAlertsPanel from "../components/TaskAlertsPanel";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { projectAPI, taskAPI } from "../services/api";
import { getSocketUrl } from "../services/config";
import { getStoredUser } from "../services/authStorage";

function TaskBoardPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const [{ data: projectData }, { data: taskData }, { data: alertData }] = await Promise.all([
        projectAPI.getById(id),
        taskAPI.getByProject(id),
        taskAPI.getAlerts(id)
      ]);
      setProject(projectData);
      setTasks(taskData);
      setAlerts(alertData);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks");
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const user = getStoredUser();
    if (!user?.token) {
      return;
    }

    const socket = io(getSocketUrl(), {
      auth: { token: user.token }
    });

    socket.on("connect", () => {
      socket.emit("join_project", id);
    });

    socket.on("task_overdue", (payload) => {
      if (payload.projectId === id) {
        setNotifications((prev) => [
          ...prev,
          { id: Date.now(), type: "overdue", message: `[Overdue] ${payload.message}` }
        ]);
        loadData();
      }
    });

    socket.on("task_deadline_warning", (payload) => {
      if (payload.projectId === id) {
        setNotifications((prev) => [
          ...prev,
          { id: Date.now(), type: "warning", message: `[Due Soon] ${payload.message}` }
        ]);
        loadData();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, loadData]);

  const dismissNotification = (notifId) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notifId));
  };

  const handleCreate = async (form, reset) => {
    try {
      setLoading(true);
      await taskAPI.create(form);
      reset();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await taskAPI.update({
        taskId: task._id,
        status
      });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task");
    }
  };

  if (!project) {
    return <div className="container py-5">{error || "Loading..."}</div>;
  }

  return (
    <div className="page-shell">
      <div className="container py-4 py-lg-5">
        <div className="workspace-header mb-4">
          <div className="d-flex flex-column flex-xl-row justify-content-between gap-3 align-items-xl-center">
            <div>
              <span className="eyebrow">Task Management</span>
              <h1 className="fw-bold mb-2">{project.title} Task Board</h1>
              <p className="text-muted mb-0">Plan responsibilities, track progress, and stay ahead of deadlines.</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Link className="btn btn-outline-dark" to={`/projects/${id}`}>
                Back to Workspace
              </Link>
              <Link className="btn btn-outline-dark" to={`/projects/${id}/files`}>
                Open Files
              </Link>
            </div>
          </div>
        </div>

        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`alert ${notif.type === "overdue" ? "alert-danger" : "alert-warning"} alert-dismissible fade show`}
            role="alert"
          >
            <strong>{notif.message}</strong>
            <button type="button" className="btn-close" onClick={() => dismissNotification(notif.id)} aria-label="Close" />
          </div>
        ))}

        {error && <div className="alert alert-danger">{error}</div>}
        <TaskAlertsPanel alerts={alerts} />

        <div className="row g-4">
          <div className="col-lg-4">
            <TaskForm members={project.members} projectId={id} onCreate={handleCreate} loading={loading} />
          </div>
          <div className="col-lg-8">
            <TaskList tasks={tasks} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskBoardPage;
