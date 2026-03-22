const crypto = require("crypto");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Message = require("../models/Message");
const File = require("../models/File");
const CodeSession = require("../models/CodeSession");
const UserActivity = require("../models/UserActivity");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const createInviteCode = () => crypto.randomBytes(3).toString("hex").toUpperCase();

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      members: [req.user._id],
      inviteCode: createInviteCode()
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    return res.status(201).json(populatedProject);
  } catch (error) {
    return res.status(500).json({ message: "Project creation failed", error: error.message });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch projects", error: error.message });
  }
};

const joinProject = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const project = await Project.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
    if (!project) {
      return res.status(404).json({ message: "Project not found with this invite code" });
    }

    if (!project.members.some((memberId) => memberId.toString() === req.user._id.toString())) {
      project.members.push(req.user._id);
      await project.save();
    }

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    return res.json(populatedProject);
  } catch (error) {
    return res.status(500).json({ message: "Unable to join project", error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some((member) => member._id.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: "Access denied for this project" });
    }

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch project", error: error.message });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id }).select("_id title");
    const projectIds = projects.map((project) => project._id);

    const [tasks, messages, files] = await Promise.all([
      Task.find({ projectId: { $in: projectIds } }).populate("assignedTo", "name"),
      Message.find({ projectId: { $in: projectIds } })
        .populate("sender", "name")
        .sort({ timestamp: -1 })
        .limit(8),
      File.find({ projectId: { $in: projectIds } })
        .populate("uploadedBy", "name")
        .sort({ createdAt: -1 })
        .limit(8)
    ]);

    const summary = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task) => task.status === "Completed").length,
      inProgressTasks: tasks.filter((task) => task.status === "In Progress").length,
      pendingTasks: tasks.filter((task) => task.status === "Pending").length,
      upcomingDeadlines: tasks
        .filter((task) => task.status !== "Completed")
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5),
      recentActivity: [
        ...messages.map((item) => ({
          type: "message",
          text: `${item.sender?.name || "A teammate"} posted in chat`,
          projectId: item.projectId,
          timestamp: item.timestamp
        })),
        ...files.map((item) => ({
          type: "file",
          text: `${item.uploadedBy?.name || "A teammate"} uploaded ${item.fileName}`,
          projectId: item.projectId,
          timestamp: item.createdAt
        }))
      ]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 8)
    };

    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load dashboard", error: error.message });
  }
};

const leaveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some((memberId) => memberId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(400).json({ message: "This project is not in your workspace" });
    }

    if (project.owner.toString() === req.user._id.toString()) {
      // Prevent owners from accidentally removing the whole team's workspace without a dedicated transfer/delete flow.
      return res.status(400).json({ message: "Project owners cannot remove their own workspace yet." });
    }

    project.members = project.members.filter((memberId) => memberId.toString() !== req.user._id.toString());
    await project.save();

    return res.json({ message: "Project removed from your workspace" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to remove project", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the project owner can delete this workspace" });
    }

    const projectFiles = await File.find({ projectId: project._id }).select("cloudinaryId");

    if (isCloudinaryConfigured()) {
      await Promise.allSettled(
        projectFiles
          .filter((file) => file.cloudinaryId)
          .map((file) => cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: "raw" }))
      );
    }

    await Promise.all([
      Task.deleteMany({ projectId: project._id }),
      Message.deleteMany({ projectId: project._id }),
      File.deleteMany({ projectId: project._id }),
      CodeSession.deleteMany({ projectId: project._id }),
      UserActivity.deleteMany({ projectId: project._id }),
      Project.deleteOne({ _id: project._id })
    ]);

    return res.json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete project", error: error.message });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  joinProject,
  getProjectById,
  getDashboardSummary,
  leaveProject,
  deleteProject
};
