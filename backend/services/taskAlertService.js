const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HIGH_PRIORITY_SUGGESTION_WINDOW_MS = 2 * DAY_IN_MS;

const toPlainTask = (task) => (typeof task.toObject === "function" ? task.toObject() : { ...task });

const decorateTaskWithAlerts = (task, referenceDate = new Date()) => {
  const plainTask = toPlainTask(task);
  const deadline = new Date(plainTask.deadline);
  const deadlineTime = deadline.getTime();
  const isCompleted = plainTask.status === "Completed";
  const hasValidDeadline = !Number.isNaN(deadlineTime);
  const remainingMs = deadlineTime - referenceDate.getTime();
  const isOverdue = hasValidDeadline && !isCompleted && remainingMs < 0;
  const isUrgent = hasValidDeadline && !isCompleted && remainingMs >= 0 && remainingMs <= DAY_IN_MS;
  const shouldSuggestHighPriority =
    hasValidDeadline &&
    !isCompleted &&
    remainingMs >= 0 &&
    remainingMs <= HIGH_PRIORITY_SUGGESTION_WINDOW_MS;

  return {
    ...plainTask,
    priority: plainTask.priority || "Medium",
    effectiveStatus: isOverdue ? "Overdue" : plainTask.status,
    suggestedPriority: shouldSuggestHighPriority ? "High" : plainTask.priority || "Medium",
    alerts: {
      isOverdue,
      isUrgent,
      remainingMs,
      shouldSuggestHighPriority
    }
  };
};

const buildTaskAlertSummary = (tasks, referenceDate = new Date()) => {
  const decoratedTasks = tasks.map((task) => decorateTaskWithAlerts(task, referenceDate));
  const overdueTasks = decoratedTasks.filter((task) => task.alerts.isOverdue);
  const upcomingTasks = decoratedTasks.filter((task) => task.alerts.isUrgent);
  const prioritySuggestions = decoratedTasks
    .filter((task) => task.alerts.shouldSuggestHighPriority && task.priority !== "High")
    .map((task) => ({
      ...task,
      suggestedPriority: "High",
      recommendation: `Consider upgrading "${task.title}" to High priority.`
    }));

  return {
    overdueTasks,
    upcomingTasks,
    prioritySuggestions,
    summary: {
      overdueCount: overdueTasks.length,
      upcomingCount: upcomingTasks.length,
      suggestionCount: prioritySuggestions.length
    }
  };
};

module.exports = {
  buildTaskAlertSummary,
  decorateTaskWithAlerts
};
