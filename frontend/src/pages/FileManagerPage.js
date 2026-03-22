import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileUploadPanel from "../components/FileUploadPanel";
import { fileAPI, projectAPI } from "../services/api";

function FileManagerPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [{ data: projectData }, { data: fileData }] = await Promise.all([
        projectAPI.getById(id),
        fileAPI.getByProject(id)
      ]);
      setProject(projectData);
      setFiles(fileData);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load files");
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpload = async (projectId, file, reset) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("file", file);
      await fileAPI.upload(formData);
      reset();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to upload file");
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div className="container py-5">{error || "Loading..."}</div>;
  }

  return (
    <div className="page-shell">
      <div className="container py-4 py-lg-5">
        <div className="mb-4">
          <span className="eyebrow">File Manager</span>
          <h1 className="fw-bold">{project.title} Files</h1>
          <p className="text-muted mb-0">Centralize reports, slides, research papers, and final submissions.</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <FileUploadPanel files={files} projectId={id} onUpload={handleUpload} loading={loading} />
      </div>
    </div>
  );
}

export default FileManagerPage;
