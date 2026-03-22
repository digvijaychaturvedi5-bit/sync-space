export const CODE_LANGUAGE_OPTIONS = [
  {
    value: "javascript",
    label: "JavaScript",
    extension: "js",
    fileName: "collaboration.js"
  },
  {
    value: "python",
    label: "Python",
    extension: "py",
    fileName: "collaboration.py"
  },
  {
    value: "cpp",
    label: "C++",
    extension: "cpp",
    fileName: "collaboration.cpp"
  }
];

export const DEFAULT_EDITOR_LANGUAGE = "javascript";
export const DEFAULT_EDITOR_THEME = "vs-dark";

export const getLanguageOption = (language) =>
  CODE_LANGUAGE_OPTIONS.find((option) => option.value === language) || CODE_LANGUAGE_OPTIONS[0];

export const buildDownloadFileName = (projectTitle, language) => {
  const option = getLanguageOption(language);
  const safeProjectTitle = (projectTitle || "sync-space")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeProjectTitle || "sync-space"}-${option.fileName}`;
};
