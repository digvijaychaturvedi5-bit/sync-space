const UserActivity = require("../models/UserActivity");
const { ensureProjectMembership } = require("../utils/projectAccess");

const getProjectContributions = async (req, res) => {
  try {
    const { projectId } = req.params;
    const access = await ensureProjectMembership(projectId, req.user._id, { populateMembers: true });

    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const activityDocs = await UserActivity.find({ projectId });
    const activityMap = new Map(activityDocs.map((activity) => [activity.userId.toString(), activity]));

    const leaderboard = access.project.members
      .map((member) => {
        const activity = activityMap.get(member._id.toString());
        const tasksCompleted = activity?.tasksCompleted || 0;
        const messagesSent = activity?.messagesSent || 0;
        const filesUploaded = activity?.filesUploaded || 0;

        return {
          userId: member._id,
          name: member.name,
          email: member.email,
          tasksCompleted,
          messagesSent,
          filesUploaded,
          totalActivity: tasksCompleted + messagesSent + filesUploaded
        };
      })
      .sort((left, right) => right.totalActivity - left.totalActivity || left.name.localeCompare(right.name))
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    return res.json({
      projectId,
      projectTitle: access.project.title,
      leaderboard
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load contribution tracker", error: error.message });
  }
};

module.exports = { getProjectContributions };
