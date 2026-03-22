const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    tasksCompleted: {
      type: Number,
      default: 0
    },
    messagesSent: {
      type: Number,
      default: 0
    },
    filesUploaded: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

userActivitySchema.index({ userId: 1, projectId: 1 }, { unique: true });

module.exports = mongoose.model("UserActivity", userActivitySchema);
