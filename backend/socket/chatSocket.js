const Message = require("../models/Message");
const { incrementUserActivity } = require("../services/activityService");
const { ensureProjectMembership } = require("../utils/projectAccess");

const getChatRoomName = (projectId) => `project:${projectId}:chat`;

const registerChatHandlers = (io, socket) => {
  socket.on("join_project", async (projectId) => {
    try {
      if (!projectId) {
        return;
      }

      const access = await ensureProjectMembership(projectId, socket.user._id);
      if (access.error) {
        socket.emit("message_error", access.error.message);
        return;
      }

      socket.join(getChatRoomName(projectId));
    } catch (error) {
      socket.emit("message_error", "Unable to join this project chat.");
    }
  });

  socket.on("send_message", async (payload) => {
    try {
      const { projectId, message } = payload || {};

      if (!projectId || !message?.trim()) {
        return;
      }

      const access = await ensureProjectMembership(projectId, socket.user._id);
      if (access.error) {
        socket.emit("message_error", access.error.message);
        return;
      }

      const savedMessage = await Message.create({
        sender: socket.user._id,
        projectId,
        message: message.trim()
      });

      await incrementUserActivity({
        userId: socket.user._id,
        projectId,
        field: "messagesSent"
      });

      const populatedMessage = await Message.findById(savedMessage._id).populate("sender", "name email");
      io.to(getChatRoomName(projectId)).emit("receive_message", populatedMessage);
    } catch (error) {
      socket.emit("message_error", "Unable to send message right now.");
    }
  });
};

module.exports = { registerChatHandlers };
