const Task = require("../models/Task");
const { incrementUserActivity } = require("../services/activityService");
const { buildTaskAlertSummary, decorateTaskWithAlerts } = require("../services/taskAlertService");
const { ensureProjectMembership } = require("../utils/projectAccess");

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority, projectId } = req.body;

    if (!title || !assignedTo || !deadline || !projectId) {
      return res.status(400).json({ message: "Title, assignee, deadline and project are required" });
    }

    const access = await ensureProjectMembership(projectId, req.user._id);
    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      priority,
      deadline,
      projectId
    });

    const populatedTask = await Task.findById(task._id).populate("assignedTo", "name email");
    return res.status(201).json(decorateTaskWithAlerts(populatedTask));
  } catch (error) {
    return res.status(500).json({ message: "Unable to create task", error: error.message });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const access = await ensureProjectMembership(req.params.id, req.user._id);
    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const tasks = await Task.find({ projectId: req.params.id })
      .populate("assignedTo", "name email")
      .sort({ deadline: 1 });

    return res.json(tasks.map((task) => decorateTaskWithAlerts(task)));
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch tasks", error: error.message });
  }
};

const getTaskAlerts = async (req, res) => {
  try {
    const access = await ensureProjectMembership(req.params.projectId, req.user._id);
    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate("assignedTo", "name email")
      .sort({ deadline: 1 });

    return res.json(buildTaskAlertSummary(tasks));
  } catch (error) {
    return res.status(500).json({ message: "Unable to load task alerts", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId, title, description, assignedTo, status, priority, deadline } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const access = await ensureProjectMembership(task.projectId, req.user._id);
    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const previousStatus = task.status;
    task.title = title || task.title;
    task.description = description ?? task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;
    task.priority = priority || task.priority || "Medium";
    task.deadline = deadline || task.deadline;

    await task.save();

    if (previousStatus !== "Completed" && task.status === "Completed") {
      // Credit the assignee when their task crosses the finish line.
      await incrementUserActivity({
        userId: task.assignedTo,
        projectId: task.projectId,
        field: "tasksCompleted"
      });
    }

    const updatedTask = await Task.findById(task._id).populate("assignedTo", "name email");
    return res.json(decorateTaskWithAlerts(updatedTask));
  } catch (error) {
    return res.status(500).json({ message: "Unable to update task", error: error.message });
  }
};

module.exports = { createTask, getProjectTasks, getTaskAlerts, updateTask };
