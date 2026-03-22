import React from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function ContributionTrackerSection({
  contributionData,
  error,
  loading,
  projects,
  selectedProjectId,
  onProjectChange
}) {
  const leaderboard = contributionData?.leaderboard || [];

  const chartData = {
    labels: leaderboard.map((entry) => entry.name),
    datasets: [
      {
        label: "Tasks",
        data: leaderboard.map((entry) => entry.tasksCompleted),
        backgroundColor: "rgba(15, 118, 110, 0.78)",
        borderRadius: 12
      },
      {
        label: "Messages",
        data: leaderboard.map((entry) => entry.messagesSent),
        backgroundColor: "rgba(249, 115, 22, 0.78)",
        borderRadius: 12
      },
      {
        label: "Files",
        data: leaderboard.map((entry) => entry.filesUploaded),
        backgroundColor: "rgba(124, 45, 18, 0.78)",
        borderRadius: 12
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <section className="card border-0 shadow-sm contribution-card mb-4">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-3 align-items-xl-center mb-4">
          <div>
            <span className="eyebrow">Contribution Tracker</span>
            <h3 className="fw-bold mb-1">See who is pushing each project forward.</h3>
            <p className="text-muted mb-0">
              Compare completed tasks, messages sent, and file uploads for the selected workspace.
            </p>
          </div>
          <div className="contribution-select-wrap">
            <label className="form-label small text-uppercase fw-bold text-muted mb-1">Project</label>
            <select className="form-select" value={selectedProjectId} onChange={onProjectChange} disabled={!projects.length}>
              {projects.length === 0 && <option value="">No projects yet</option>}
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {!projects.length && (
          <div className="empty-state-card p-4">
            <p className="text-muted mb-0">Create or join a project to start tracking team contributions.</p>
          </div>
        )}

        {projects.length > 0 && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="d-grid gap-3">
                {loading && <div className="member-row p-3">Loading contribution data...</div>}

                {!loading && leaderboard.length === 0 && (
                  <div className="member-row p-3">
                    <div className="fw-semibold">No tracked activity yet</div>
                    <div className="small text-muted">
                      Contributions will appear here as teammates finish tasks, send messages, and upload files.
                    </div>
                  </div>
                )}

                {!loading &&
                  leaderboard.map((entry) => (
                    <div key={entry.userId} className="member-row p-3 contribution-row">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="contribution-rank">#{entry.rank}</span>
                            <div className="fw-semibold">{entry.name}</div>
                          </div>
                          <div className="small text-muted mt-1">{entry.email}</div>
                        </div>
                        <span className="editor-status-pill">{entry.totalActivity} actions</span>
                      </div>
                      <div className="small text-muted mt-3 contribution-stats">
                        Tasks {entry.tasksCompleted} | Messages {entry.messagesSent} | Files {entry.filesUploaded}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="col-lg-7">
              <div className="contribution-chart-wrap">
                {leaderboard.length > 0 ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <div className="empty-state-card h-100 d-flex align-items-center justify-content-center p-4">
                    <p className="text-muted mb-0">The chart will populate once this project has measurable activity.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ContributionTrackerSection;
