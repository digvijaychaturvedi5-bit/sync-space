const express = require("express");
const {
  createProject,
  getUserProjects,
  joinProject,
  getProjectById,
  getDashboardSummary,
  leaveProject,
  deleteProject
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createProject);
router.get("/user-projects", protect, getUserProjects);
router.post("/join", protect, joinProject);
router.delete("/:id/leave", protect, leaveProject);
router.delete("/:id", protect, deleteProject);
router.get("/dashboard", protect, getDashboardSummary);
router.get("/:id", protect, getProjectById);

module.exports = router;
