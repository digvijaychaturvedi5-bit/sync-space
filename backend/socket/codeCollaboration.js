const { ensureProjectMembership } = require("../utils/projectAccess");
const {
  findOrCreateCodeSession,
  mapCodeSession,
  saveCodeSession
} = require("../services/codeSessionService");

const activeCodeUsers = new Map();

const getCodeRoomName = (projectId) => `project:${projectId}:code`;

const getProjectPresenceMap = (projectId) => {
  if (!activeCodeUsers.has(projectId)) {
    activeCodeUsers.set(projectId, new Map());
  }

  return activeCodeUsers.get(projectId);
};

const getActiveUsers = (projectId) => Array.from(activeCodeUsers.get(projectId)?.values() || []);

const emitPresenceOnly = (io, projectId, reason) => {
  io.to(getCodeRoomName(projectId)).emit("sync_code", {
    projectId,
    activeUsers: getActiveUsers(projectId),
    reason
  });
};

const leaveCurrentCodeRoom = async (io, socket) => {
  const currentProjectId = socket.data.codeProjectId;
  if (!currentProjectId) {
    return;
  }

  socket.leave(getCodeRoomName(currentProjectId));
  getProjectPresenceMap(currentProjectId).delete(socket.id);

  if (getProjectPresenceMap(currentProjectId).size === 0) {
    activeCodeUsers.delete(currentProjectId);
  }

  socket.data.codeProjectId = null;

  emitPresenceOnly(io, currentProjectId, "presence");
};

const registerCodeCollaborationHandlers = (io, socket) => {
  socket.on("join_code_room", async (payload) => {
    try {
      const { projectId } = payload || {};

      if (!projectId) {
        socket.emit("code_error", "Project id is required to join the editor.");
        return;
      }

      const access = await ensureProjectMembership(projectId, socket.user._id);
      if (access.error) {
        socket.emit("code_error", access.error.message);
        return;
      }

      if (socket.data.codeProjectId && socket.data.codeProjectId !== projectId) {
        await leaveCurrentCodeRoom(io, socket);
      }

      const codeSession = await findOrCreateCodeSession(projectId);
      socket.join(getCodeRoomName(projectId));
      socket.data.codeProjectId = projectId;

      // Presence is stored by socket id so refreshes and multi-tab use stay isolated.
      getProjectPresenceMap(projectId).set(socket.id, {
        _id: socket.user._id,
        name: socket.user.name,
        email: socket.user.email
      });

      // The joining user receives the full document snapshot, while peers only get presence updates.
      socket.emit("sync_code", {
        ...mapCodeSession(codeSession),
        activeUsers: getActiveUsers(projectId),
        reason: "joined"
      });
      socket.to(getCodeRoomName(projectId)).emit("sync_code", {
        projectId,
        activeUsers: getActiveUsers(projectId),
        reason: "presence"
      });
    } catch (error) {
      socket.emit("code_error", "Unable to open the collaborative editor.");
    }
  });

  socket.on("code_change", async (payload) => {
    try {
      const { projectId, codeContent, language } = payload || {};

      if (!projectId || typeof codeContent !== "string") {
        return;
      }

      if (socket.data.codeProjectId && socket.data.codeProjectId !== projectId) {
        return;
      }

      const access = await ensureProjectMembership(projectId, socket.user._id);
      if (access.error) {
        socket.emit("code_error", access.error.message);
        return;
      }

      const codeSession = await saveCodeSession({ projectId, codeContent, language });
      socket.to(getCodeRoomName(projectId)).emit("sync_code", {
        ...mapCodeSession(codeSession),
        activeUsers: getActiveUsers(projectId),
        reason: "remote-update",
        updatedBy: socket.user.name
      });
    } catch (error) {
      socket.emit("code_error", "Unable to sync code changes right now.");
    }
  });

  socket.on("disconnect", async () => {
    try {
      const projectId = socket.data.codeProjectId;
      if (!projectId) {
        return;
      }

      getProjectPresenceMap(projectId).delete(socket.id);

      if (getProjectPresenceMap(projectId).size === 0) {
        activeCodeUsers.delete(projectId);
      }

      emitPresenceOnly(io, projectId, "presence");
    } catch (error) {
      // Ignore disconnect cleanup errors because the socket is already closing.
    }
  });
};

module.exports = { registerCodeCollaborationHandlers };
