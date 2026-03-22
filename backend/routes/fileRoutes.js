const express = require("express");
const multer = require("multer");
const { uploadFile, getProjectFiles } = require("../controllers/fileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/project/:id", protect, getProjectFiles);

module.exports = router;
