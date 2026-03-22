const express = require("express");
const { getCodeSession, persistCodeSession } = require("../controllers/codeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:projectId", protect, getCodeSession);
router.post("/save", protect, persistCodeSession);

module.exports = router;
