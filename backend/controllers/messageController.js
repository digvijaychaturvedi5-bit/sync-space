const Message = require("../models/Message");
const { incrementUserActivity } = require("../services/activityService");
const { ensureProjectMembership } = require("../utils/projectAccess");

const getMessages = async (req, res) => {
  try {
    const access = await ensureProjectMembership(req.params.projectId, req.user._id);
    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const messages = await Message.find({ projectId: req.params.projectId })
      .populate("sender", "name email")
      .sort({ timestamp: 1 });

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch messages", error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { projectId, message } = req.body;

    if (!projectId || !message) {
      return res.status(400).json({ message: "Project and message are required" });
    }

    const access = await ensureProjectMembership(projectId, req.user._id);
    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      projectId,
      message
    });

    await incrementUserActivity({
      userId: req.user._id,
      projectId,
      field: "messagesSent"
    });

    const populatedMessage = await Message.findById(newMessage._id).populate("sender", "name email");
    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: "Unable to send message", error: error.message });
  }
};

module.exports = { getMessages, sendMessage };
