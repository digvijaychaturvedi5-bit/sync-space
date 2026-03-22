import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { messageAPI, projectAPI } from "../services/api";

function ChatSectionPage() {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("syncSpaceUser"));
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
        <div className="mb-4">
          <span className="eyebrow">Team Communication</span>
          <h1 className="fw-bold">{project.title} Chat</h1>
          <p className="text-muted mb-0">Share updates, unblock teammates, and keep discussion inside the workspace.</p>
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
