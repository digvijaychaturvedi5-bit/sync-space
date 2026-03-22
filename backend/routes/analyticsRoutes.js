const express = require("express");
const { getProjectContributions } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/contributions/:projectId", protect, getProjectContributions);

module.exports = router;
