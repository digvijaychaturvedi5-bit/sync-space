const UserActivity = require("../models/UserActivity");

const ACTIVITY_FIELDS = ["tasksCompleted", "messagesSent", "filesUploaded"];

const incrementUserActivity = async ({ userId, projectId, field, amount = 1 }) => {
  if (!userId || !projectId || !ACTIVITY_FIELDS.includes(field)) {
    return null;
  }

  // Upsert keeps analytics lightweight because activity documents are created only when needed.
  return UserActivity.findOneAndUpdate(
    { userId, projectId },
    {
      $inc: { [field]: amount }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );
};

module.exports = { incrementUserActivity };
