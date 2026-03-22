const { ensureProjectMembership } = require("../utils/projectAccess");
const {
  findOrCreateCodeSession,
  mapCodeSession,
  saveCodeSession
} = require("../services/codeSessionService");

const getCodeSession = async (req, res) => {
  try {
    const { projectId } = req.params;
    const access = await ensureProjectMembership(projectId, req.user._id);

    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const codeSession = await findOrCreateCodeSession(projectId);
    return res.json(mapCodeSession(codeSession));
  } catch (error) {
    return res.status(500).json({ message: "Unable to load code session", error: error.message });
  }
};

const persistCodeSession = async (req, res) => {
  try {
    const { projectId, codeContent, language } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project is required" });
    }

    const access = await ensureProjectMembership(projectId, req.user._id);
    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const codeSession = await saveCodeSession({ projectId, codeContent, language });
    return res.json(mapCodeSession(codeSession));
  } catch (error) {
    return res.status(500).json({ message: "Unable to save code session", error: error.message });
  }
};

module.exports = { getCodeSession, persistCodeSession };
