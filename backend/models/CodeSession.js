const mongoose = require("mongoose");
const {
  DEFAULT_CODE_LANGUAGE,
  SUPPORTED_CODE_LANGUAGES,
  getDefaultCodeTemplate
} = require("../constants/codeEditor");

const codeSessionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true
    },
    language: {
      type: String,
      enum: SUPPORTED_CODE_LANGUAGES,
      default: DEFAULT_CODE_LANGUAGE
    },
    codeContent: {
      type: String,
      default: () => getDefaultCodeTemplate(DEFAULT_CODE_LANGUAGE)
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

codeSessionSchema.index({ projectId: 1 }, { unique: true });

module.exports = mongoose.model("CodeSession", codeSessionSchema);
