import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { analyticsAPI, projectAPI } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function ContributionDashboard() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [contributionData, setContributionData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [{ data: projectData }, { data: contribData }] = await Promise.all([
        projectAPI.getById(id),
        analyticsAPI.getContributions(id)
      ]);
      setProject(projectData);
      setContributionData(contribData);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load contribution data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const leaderboard = contributionData?.leaderboard || [];

  const chartData = {
    labels: leaderboard.map((entry) => entry.name),
    datasets: [
      {
        label: "Tasks Completed",
        data: leaderboard.map((entry) => entry.tasksCompleted),
        backgroundColor: "rgba(45, 212, 191, 0.72)",
        borderRadius: 12
      },
      {
        label: "Messages Sent",
        data: leaderboard.map((entry) => entry.messagesSent),
        backgroundColor: "rgba(249, 115, 22, 0.78)",
        borderRadius: 12
      },
      {
        label: "Files Uploaded",
        data: leaderboard.map((entry) => entry.filesUploaded),
        backgroundColor: "rgba(251, 191, 36, 0.58)",
        borderRadius: 12
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: "bottom" }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  if (loading && !project) {
    return (
      <div className="page-shell">
        <div className="container py-5">{error ? <div className="alert alert-danger">{error}</div> : "Loading..."}</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container py-4 py-lg-5">
        <div className="workspace-header mb-4">
          <div className="d-flex flex-column flex-xl-row justify-content-between gap-3 align-items-xl-center">
            <div>
              <span className="eyebrow">Contribution Tracker</span>
              <h1 className="fw-bold mb-2">{project?.title} Team Contributions</h1>
              <p className="text-muted mb-0">
                Compare completed tasks, messages sent, and file uploads across the team.
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Link to={`/projects/${id}`} className="btn btn-outline-dark">
                Back to Workspace
              </Link>
              <Link to={`/projects/${id}/tasks`} className="btn btn-outline-dark">
                Open Task Board
              </Link>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Leaderboard</h4>
                {leaderboard.length === 0 ? (
                  <p className="text-muted mb-0">
                    No contributions yet. Activity will appear here as teammates complete tasks, send messages, and upload files.
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                      <thead>
                        <tr className="small text-uppercase text-muted">
                          <th>#</th>
                          <th>Name</th>
                          <th className="text-center">Tasks</th>
                          <th className="text-center">Messages</th>
                          <th className="text-center">Files</th>
                          <th className="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((entry) => (
                          <tr key={entry.userId}>
                            <td>
                              <span className="contribution-rank">{entry.rank}</span>
                            </td>
                            <td>
                              <div className="fw-semibold">{entry.name}</div>
                              <div className="small text-muted">{entry.email}</div>
                            </td>
                            <td className="text-center fw-semibold">{entry.tasksCompleted}</td>
                            <td className="text-center fw-semibold">{entry.messagesSent}</td>
                            <td className="text-center fw-semibold">{entry.filesUploaded}</td>
                            <td className="text-center">
                              <span className="editor-status-pill">{entry.totalActivity}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Activity Comparison</h4>
                <div className="contribution-chart-wrap">
                  {leaderboard.length > 0 ? (
                    <Bar data={chartData} options={chartOptions} />
                  ) : (
                    <div className="h-100 d-flex align-items-center justify-content-center">
                      <p className="text-muted mb-0">The chart will populate once this project has measurable activity.</p>
                    </div>
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

export default ContributionDashboard;
