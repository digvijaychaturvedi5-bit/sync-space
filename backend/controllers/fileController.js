const path = require("path");
const File = require("../models/File");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");
const { incrementUserActivity } = require("../services/activityService");
const { ensureProjectMembership } = require("../utils/projectAccess");

const uploadToCloudinary = (file, projectId) =>
  new Promise((resolve, reject) => {
    const baseName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9-_]/g, "-");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${process.env.CLOUDINARY_FOLDER || "sync-space"}/projects/${projectId}`,
        public_id: `${Date.now()}-${baseName}`,
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ message: "Project is required" });
    }

    const access = await ensureProjectMembership(projectId, req.user._id);
    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        message: "Cloudinary is not configured. Add cloud name, API key, and API secret in backend .env."
      });
    }

    const uploadedAsset = await uploadToCloudinary(req.file, projectId);

    const savedFile = await File.create({
      fileName: req.file.originalname,
      filePath: uploadedAsset.secure_url,
      cloudinaryId: uploadedAsset.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      projectId
    });

    await incrementUserActivity({
      userId: req.user._id,
      projectId,
      field: "filesUploaded"
    });

    const populatedFile = await File.findById(savedFile._id).populate("uploadedBy", "name email");
    return res.status(201).json(populatedFile);
  } catch (error) {
    return res.status(500).json({ message: "File upload failed", error: error.message });
  }
};

const getProjectFiles = async (req, res) => {
  try {
    const access = await ensureProjectMembership(req.params.id, req.user._id);
    if (access.error) {
      return res.status(access.error.code).json({ message: access.error.message });
    }

    const files = await File.find({ projectId: req.params.id })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.json(files);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch files", error: error.message });
  }
};

module.exports = { uploadFile, getProjectFiles };
