import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { messageAPI, projectAPI } from "../services/api";
import { getStoredUser } from "../services/authStorage";

function ChatSectionPage() {
  const { id } = useParams();
  const currentUser = getStoredUser();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    try {
      const { data } = await messageAPI.getByProject(id);
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load messages");
    }
  }, [id]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const { data } = await projectAPI.getById(id);
        setProject(data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load chat");
      }
    };

    loadProject();
  }, [id]);

  if (!project) {
    return <div className="container py-5">{error || "Loading..."}</div>;
  }

  return (
    <div className="page-shell">
      <div className="container py-4 py-lg-5">
        <div className="workspace-header mb-4">
          <div className="d-flex flex-column flex-xl-row justify-content-between gap-3 align-items-xl-center">
            <div>
              <span className="eyebrow">Team Communication</span>
              <h1 className="fw-bold mb-2">{project.title} Chat</h1>
              <p className="text-muted mb-0">
                Share updates, unblock teammates, and keep discussion inside the workspace.
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Link className="btn btn-outline-dark" to={`/projects/${id}`}>
                Back to Workspace
              </Link>
              <Link className="btn btn-outline-dark" to={`/projects/${id}/code`}>
                Open Code Editor
              </Link>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row justify-content-center">
          <div className="col-xl-9">
            <ChatBox
              projectId={id}
              currentUser={currentUser}
              messages={messages}
              setMessages={setMessages}
              loadMessages={loadMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSectionPage;
