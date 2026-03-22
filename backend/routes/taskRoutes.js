const express = require("express");
const { createTask, getProjectTasks, getTaskAlerts, updateTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createTask);
router.get("/alerts/:projectId", protect, getTaskAlerts);
router.get("/project/:id", protect, getProjectTasks);
router.put("/update", protect, updateTask);

module.exports = router;
