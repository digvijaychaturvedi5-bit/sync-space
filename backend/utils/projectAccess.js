const Project = require("../models/Project");

const normalizeId = (value) => {
  if (!value) {
    return "";
  }

  return value._id ? value._id.toString() : value.toString();
};

const ensureProjectMembership = async (projectId, userId, options = {}) => {
  const { populateMembers = false } = options;
  let query = Project.findById(projectId);

  if (populateMembers) {
    query = query.populate("owner", "name email").populate("members", "name email");
  }

  const project = await query;
  if (!project) {
    return { error: { code: 404, message: "Project not found" } };
  }

  const isMember = project.members.some((member) => normalizeId(member) === normalizeId(userId));
  if (!isMember) {
    return { error: { code: 403, message: "Access denied for this project" } };
  }

  return { project };
};

module.exports = { ensureProjectMembership };
