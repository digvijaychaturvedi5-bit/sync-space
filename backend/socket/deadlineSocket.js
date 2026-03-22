const Task = require("../models/Task");
const { decorateTaskWithAlerts } = require("../services/taskAlertService");

const CHECK_INTERVAL_MS = 60 * 1000; // every 60 seconds

const getProjectRoom = (projectId) => `project:${projectId}:chat`;

const registerDeadlineHandlers = (io) => {
  const checkDeadlines = async () => {
    try {
      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Find tasks that are not completed and have a deadline within 24 hours or already past.
      const tasks = await Task.find({
        status: { $nin: ["Completed"] },
        deadline: { $lte: in24Hours }
      }).populate("assignedTo", "name email");

      if (!tasks.length) {
        return;
      }

      const decorated = tasks.map((task) => decorateTaskWithAlerts(task, now));

      const overdueTasks = decorated.filter((t) => t.alerts.isOverdue);
      const urgentTasks = decorated.filter((t) => t.alerts.isUrgent);

      // Group by project so notifications reach the correct rooms.
      const projectGroups = new Map();
      for (const task of [...overdueTasks, ...urgentTasks]) {
        const pid = task.projectId.toString();
        if (!projectGroups.has(pid)) {
          projectGroups.set(pid, { overdue: [], urgent: [] });
        }

        const group = projectGroups.get(pid);
        if (task.alerts.isOverdue) {
          group.overdue.push(task);
        } else if (task.alerts.isUrgent) {
          group.urgent.push(task);
        }
      }

      for (const [projectId, group] of projectGroups) {
        const room = getProjectRoom(projectId);

        if (group.overdue.length) {
          io.to(room).emit("task_overdue", {
            projectId,
            tasks: group.overdue,
            message: `${group.overdue.length} task(s) are overdue`
          });
        }

        if (group.urgent.length) {
          io.to(room).emit("task_deadline_warning", {
            projectId,
            tasks: group.urgent,
            message: `${group.urgent.length} task(s) due within 24 hours`
          });
        }
      }
    } catch (error) {
      console.error("Deadline check error:", error.message);
    }
  };

  // Run the first check shortly after startup, then repeat on an interval.
  setTimeout(checkDeadlines, 5000);
  setInterval(checkDeadlines, CHECK_INTERVAL_MS);
};

module.exports = { registerDeadlineHandlers };
