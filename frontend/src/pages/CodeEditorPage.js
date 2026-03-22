import React, { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Link, useParams } from "react-router-dom";
import EditorPresenceList from "../components/code-editor/EditorPresenceList";
import EditorToolbar from "../components/code-editor/EditorToolbar";
import {
  buildDownloadFileName,
  DEFAULT_EDITOR_LANGUAGE,
  DEFAULT_EDITOR_THEME
} from "../constants/codeEditor";
import { codeAPI, projectAPI } from "../services/api";
import { createAuthenticatedSocket } from "../services/socket";

function CodeEditorPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [codeContent, setCodeContent] = useState("");
  const [language, setLanguage] = useState(DEFAULT_EDITOR_LANGUAGE);
  const [theme, setTheme] = useState(DEFAULT_EDITOR_THEME);
  const [activeUsers, setActiveUsers] = useState([]);
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const [saveState, setSaveState] = useState("Up to date");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const syncTimerRef = useRef(null);
  const remoteUpdateRef = useRef(false);
  const codeRef = useRef("");
  const languageRef = useRef(DEFAULT_EDITOR_LANGUAGE);

  const applyRemoteSnapshot = useCallback((payload) => {
    if (typeof payload.codeContent === "string" && payload.codeContent !== codeRef.current) {
      // Mark remote patches so the editor does not echo them back into the socket stream.
      remoteUpdateRef.current = true;
      codeRef.current = payload.codeContent;
      setCodeContent(payload.codeContent);

      window.setTimeout(() => {
        remoteUpdateRef.current = false;
      }, 0);
    }

    if (payload.language) {
      languageRef.current = payload.language;
      setLanguage(payload.language);
    }

    if (Array.isArray(payload.activeUsers)) {
      setActiveUsers(payload.activeUsers);
    }
  }, []);

  const loadEditor = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [{ data: projectData }, { data: codeData }] = await Promise.all([
        projectAPI.getById(id),
        codeAPI.getByProject(id)
      ]);

      setProject(projectData);
      codeRef.current = codeData.codeContent;
      languageRef.current = codeData.language || DEFAULT_EDITOR_LANGUAGE;
      setCodeContent(codeData.codeContent);
      setLanguage(codeData.language || DEFAULT_EDITOR_LANGUAGE);
      setSaveState("Ready to collaborate");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load collaborative editor");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEditor();
  }, [loadEditor]);

  useEffect(() => {
    const socket = createAuthenticatedSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setSocketStatus("Live connection active");
      socket.emit("join_code_room", { projectId: id });
    };

    const handleDisconnect = () => {
      setSocketStatus("Disconnected");
    };

    const handleSyncCode = (payload) => {
      if (!payload || String(payload.projectId) !== id) {
        return;
      }

      if (Array.isArray(payload.activeUsers)) {
        setActiveUsers(payload.activeUsers);
      }

      if (payload.reason === "joined") {
        applyRemoteSnapshot(payload);
        setSocketStatus("Live with teammates");
        return;
      }

      if (payload.reason === "remote-update") {
        applyRemoteSnapshot(payload);
        setSaveState(payload.updatedBy ? `Synced from ${payload.updatedBy}` : "Synced from teammate");
      }
    };

    const handleCodeError = (message) => {
      setError(message?.message || message || "Unable to connect to the collaborative editor");
    };

    const handleConnectError = (connectionError) => {
      setSocketStatus("Realtime unavailable");
      setError(connectionError?.message || "Unable to connect to the collaborative editor");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("sync_code", handleSyncCode);
    socket.on("code_error", handleCodeError);
    socket.connect();

    return () => {
      window.clearTimeout(syncTimerRef.current);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("sync_code", handleSyncCode);
      socket.off("code_error", handleCodeError);
      socket.disconnect();
    };
  }, [applyRemoteSnapshot, id]);

  const broadcastCodeChange = useCallback(
    (nextCode, nextLanguage) => {
      window.clearTimeout(syncTimerRef.current);

      syncTimerRef.current = window.setTimeout(() => {
        socketRef.current?.emit("code_change", {
          projectId: id,
          codeContent: nextCode,
          language: nextLanguage
        });
      }, 180);
    },
    [id]
  );

  const handleEditorChange = (value = "") => {
    if (remoteUpdateRef.current) {
      return;
    }

    codeRef.current = value;
    setCodeContent(value);
    setSaveState("Local changes pending");
    broadcastCodeChange(value, languageRef.current);
  };

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    languageRef.current = nextLanguage;
    setLanguage(nextLanguage);
    setSaveState("Language updated");
    broadcastCodeChange(codeRef.current, nextLanguage);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      await codeAPI.save({
        projectId: id,
        codeContent: codeRef.current,
        language: languageRef.current
      });

      setSaveState(`Saved at ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save code session");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    // Download the current editor buffer as a file so teams can export snapshots anytime.
    const file = new Blob([codeRef.current], { type: "text/plain;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = buildDownloadFileName(project?.title, languageRef.current);
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  };

  if (loading) {
    return <div className="container py-5">{error || "Loading collaborative editor..."}</div>;
  }

  if (!project) {
    return <div className="container py-5">{error || "Project not found"}</div>;
  }

  return (
    <div className="page-shell">
      <div className="container py-4 py-lg-5">
        <div className="workspace-header mb-4">
          <div className="d-flex flex-column flex-xl-row justify-content-between gap-3 align-items-xl-center">
            <div>
              <span className="eyebrow">Collaborative Coding</span>
              <h1 className="fw-bold mb-2">{project.title} Code Editor</h1>
              <p className="text-muted mb-0">
                Write together in real time, switch languages instantly, and keep every project's code inside its
                workspace.
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Link className="btn btn-outline-dark" to={`/projects/${id}`}>
                Back to Workspace
              </Link>
              <Link className="btn btn-outline-dark" to={`/projects/${id}/chat`}>
                Open Team Chat
              </Link>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          <div className="col-xl-9">
            <div className="card border-0 shadow-sm code-editor-card">
              <div className="card-body p-4">
                <EditorToolbar
                  language={language}
                  onDownload={handleDownload}
                  onLanguageChange={handleLanguageChange}
                  onSave={handleSave}
                  onThemeToggle={() => setTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"))}
                  saveState={saveState}
                  saving={saving}
                  socketStatus={socketStatus}
                  theme={theme}
                />

                <div className="editor-shell">
                  <Editor
                    height="70vh"
                    language={language}
                    onChange={handleEditorChange}
                    options={{
                      automaticLayout: true,
                      autoIndent: "advanced",
                      fontSize: 15,
                      formatOnPaste: true,
                      formatOnType: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      wordWrap: "on"
                    }}
                    theme={theme}
                    value={codeContent}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="d-grid gap-4">
              <EditorPresenceList activeUsers={activeUsers} />

              <div className="card border-0 shadow-sm code-sidebar-card">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-3">Editor Notes</h4>
                  <div className="d-grid gap-3">
                    <div className="member-row p-3">
                      <div className="fw-semibold">Project Members</div>
                      <div className="small text-muted">{project.members?.length || 0} teammates can access this room.</div>
                    </div>
                    <div className="member-row p-3">
                      <div className="fw-semibold">Instant Sync</div>
                      <div className="small text-muted">Changes are debounced before broadcast to keep typing smooth.</div>
                    </div>
                    <div className="member-row p-3">
                      <div className="fw-semibold">Persistent Session</div>
                      <div className="small text-muted">The latest project code is stored on the server for reloads.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditorPage;
