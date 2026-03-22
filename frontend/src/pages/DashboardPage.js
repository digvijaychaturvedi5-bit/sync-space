import React, { useEffect, useState } from "react";
import ContributionTrackerSection from "../components/ContributionTrackerSection";
import CreateProjectModal from "../components/CreateProjectModal";
import JoinProjectCard from "../components/JoinProjectCard";
import ProjectCard from "../components/ProjectCard";
import SummaryCard from "../components/SummaryCard";
import { analyticsAPI, projectAPI } from "../services/api";

function DashboardPage() {
  const currentUser = JSON.parse(localStorage.getItem("syncSpaceUser"));
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState(null);
  const [contributionData, setContributionData] = useState(null);
  const [error, setError] = useState("");
  const [contributionError, setContributionError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [contributionLoading, setContributionLoading] = useState(false);
  const [removingProjectId, setRemovingProjectId] = useState("");
  const [loading, setLoading] = useState(false);

  const loadDashboard = async () => {
    try {
      const [{ data: projectData }, { data: dashboardData }] = await Promise.all([
        projectAPI.getUserProjects(),
        projectAPI.getDashboard()
      ]);
      setProjects(projectData);
      setSummary(dashboardData);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!projects.length) {
      setSelectedProjectId("");
      setContributionData(null);
      return;
    }

    const projectStillExists = projects.some((project) => project._id === selectedProjectId);
    if (!projectStillExists) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const loadContributions = async () => {
      if (!selectedProjectId) {
        return;
      }

      try {
        setContributionLoading(true);
        setContributionError("");

        const { data } = await analyticsAPI.getContributions(selectedProjectId);
        setContributionData(data);
      } catch (err) {
        setContributionError(err.response?.data?.message || "Unable to load contribution tracker");
      } finally {
        setContributionLoading(false);
      }
    };

    loadContributions();
  }, [selectedProjectId]);

  const handleCreateProject = async (form, reset) => {
    try {
      setLoading(true);
      await projectAPI.create(form);
      reset();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async (inviteCode, reset) => {
    try {
      setLoading(true);
      await projectAPI.join({ inviteCode });
      reset();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to join project");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProject = async (project) => {
    const isOwner = project.owner?._id === currentUser?._id;
    const confirmed = window.confirm(
      isOwner
        ? `Delete "${project.title}" for everyone? This will permanently remove its tasks, files, chat, and code session.`
        : `Remove "${project.title}" from your workspace?`
    );
    if (!confirmed) {
      return;
    }

    try {
      setRemovingProjectId(project._id);
      if (isOwner) {
        await projectAPI.deleteProject(project._id);
      } else {
        await projectAPI.leave(project._id);
      }
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update project workspace");
    } finally {
      setRemovingProjectId("");
    }
  };

  return (
    <div className="page-shell">
      <div className="container py-4 py-lg-5">
        <section className="hero-banner mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="eyebrow">Workspace Overview</span>
              <h1 className="display-5 fw-bold">Run projects, deadlines, files, and team chat from one place.</h1>
              <p className="lead text-muted mb-0">
                Sync Space keeps student teams aligned from kickoff to final presentation.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="hero-highlight-grid">
                <div className="hero-highlight-card">
                  <span className="hero-highlight-label">Focus</span>
                  <strong>One place for tasks, files, and updates</strong>
                </div>
                <div className="hero-highlight-card">
                  <span className="hero-highlight-label">Speed</span>
                  <strong>Create or join a workspace in under a minute</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && <div className="alert alert-danger">{error}</div>}

        {summary && (
          <div className="row g-3 mb-4">
            <SummaryCard title="Projects" value={summary.totalProjects} subtitle="Shared workspaces" />
            <SummaryCard title="Tasks" value={summary.totalTasks} subtitle="Across all teams" />
            <SummaryCard title="Completed" value={summary.completedTasks} subtitle="Delivered items" />
            <SummaryCard title="In Progress" value={summary.inProgressTasks} subtitle="Active workload" />
          </div>
        )}

        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <CreateProjectModal onCreate={handleCreateProject} loading={loading} />
          </div>
          <div className="col-lg-6">
            <JoinProjectCard onJoin={handleJoinProject} loading={loading} />
          </div>
        </div>

        <ContributionTrackerSection
          contributionData={contributionData}
          error={contributionError}
          loading={contributionLoading}
          onProjectChange={(event) => setSelectedProjectId(event.target.value)}
          projects={projects}
          selectedProjectId={selectedProjectId}
        />

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold mb-0">Your Project Spaces</h3>
              <span className="text-muted small">{projects.length} workspaces</span>
            </div>
            <div className="row g-4">
              {projects.length === 0 && (
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-4 empty-state-card">
                      <p className="text-muted mb-0">
                        You have not joined a workspace yet. Create one or enter an invite code to get started.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  currentUser={currentUser}
                  onRemove={handleRemoveProject}
                  project={project}
                  removing={removingProjectId === project._id}
                />
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 side-panel-card">
                <h4 className="fw-bold mb-3">Recent Activity</h4>
                <div className="d-grid gap-3">
                  {summary?.recentActivity?.length ? (
                    summary.recentActivity.map((activity, index) => (
                      <div key={`${activity.type}-${index}`} className="activity-item p-3">
                        <div className="fw-semibold text-dark">{activity.text}</div>
                        <div className="small text-muted">{new Date(activity.timestamp).toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted mb-0">Recent activity will appear here once your team starts collaborating.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
