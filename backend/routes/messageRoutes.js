const express = require("express");
const { getMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:projectId", protect, getMessages);
router.post("/send", protect, sendMessage);

module.exports = router;
