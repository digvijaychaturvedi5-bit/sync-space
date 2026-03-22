import React from "react";
import { CODE_LANGUAGE_OPTIONS } from "../../constants/codeEditor";

function EditorToolbar({
  language,
  theme,
  saveState,
  socketStatus,
  onDownload,
  onLanguageChange,
  onSave,
  onThemeToggle,
  saving
}) {
  return (
    <div className="code-toolbar d-flex flex-column flex-xl-row justify-content-between gap-3 mb-3">
      <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
        <div>
          <label className="form-label small text-uppercase fw-bold text-muted mb-1">Language</label>
          <select className="form-select" value={language} onChange={onLanguageChange}>
            {CODE_LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="editor-status-group">
          <div className="editor-status-label">Realtime</div>
          <div className="editor-status-value">{socketStatus}</div>
        </div>
        <div className="editor-status-group">
          <div className="editor-status-label">Save State</div>
          <div className="editor-status-value">{saveState}</div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 align-items-center">
        <button className="btn btn-outline-dark" type="button" onClick={onThemeToggle}>
          {theme === "vs-dark" ? "Light Theme" : "Dark Theme"}
        </button>
        <button className="btn btn-outline-dark" type="button" onClick={onDownload}>
          Download
        </button>
        <button className="btn btn-dark" type="button" onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Snapshot"}
        </button>
      </div>
    </div>
  );
}

export default EditorToolbar;
