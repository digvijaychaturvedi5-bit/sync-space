const CodeSession = require("../models/CodeSession");
const {
  DEFAULT_CODE_LANGUAGE,
  getDefaultCodeTemplate,
  normalizeCodeLanguage
} = require("../constants/codeEditor");

const mapCodeSession = (codeSession) => ({
  _id: codeSession._id,
  projectId: codeSession.projectId,
  language: codeSession.language,
  codeContent: codeSession.codeContent,
  lastUpdated: codeSession.lastUpdated,
  updatedAt: codeSession.updatedAt
});

const findOrCreateCodeSession = async (projectId) => {
  // Use an atomic upsert so simultaneous first-time joins do not race each other.
  const codeSession = await CodeSession.findOneAndUpdate(
    { projectId },
    {
      $setOnInsert: {
        projectId,
        language: DEFAULT_CODE_LANGUAGE,
        codeContent: getDefaultCodeTemplate(DEFAULT_CODE_LANGUAGE),
        lastUpdated: new Date()
      }
    },
    {
      new: true,
      upsert: true
    }
  );

  return codeSession;
};

const saveCodeSession = async ({ projectId, codeContent, language }) => {
  const codeSession = await findOrCreateCodeSession(projectId);

  const nextLanguage = language ? normalizeCodeLanguage(language) : codeSession.language;
  codeSession.language = nextLanguage;

  if (typeof codeContent === "string") {
    codeSession.codeContent = codeContent;
  }

  if (!codeSession.codeContent) {
    codeSession.codeContent = getDefaultCodeTemplate(nextLanguage);
  }

  codeSession.lastUpdated = new Date();
  await codeSession.save();

  return codeSession;
};

module.exports = {
  findOrCreateCodeSession,
  mapCodeSession,
  saveCodeSession
};
