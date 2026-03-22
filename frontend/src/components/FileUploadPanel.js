import React, { useState } from "react";
import { getApiOrigin } from "../services/config";

function FileUploadPanel({ files, projectId, onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const getFileUrl = (file) => {
    if (file.filePath?.startsWith("http://") || file.filePath?.startsWith("https://")) {
      return file.filePath;
    }

    return `${getApiOrigin()}${file.filePath}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      return;
    }

    await onUpload(projectId, selectedFile, () => setSelectedFile(null));
    event.target.reset();
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="row g-4">
          <div className="col-lg-5">
            <h4 className="fw-bold mb-3">Upload File</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                className="form-control mb-3"
                onChange={(event) => setSelectedFile(event.target.files[0])}
                required
              />
              <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                {loading ? "Uploading..." : "Upload to Workspace"}
              </button>
            </form>
          </div>
          <div className="col-lg-7">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">Shared Files</h4>
              <span className="text-muted small">{files.length} items</span>
            </div>
            <div className="d-grid gap-3">
              {files.length === 0 && <p className="text-muted mb-0">No files uploaded yet.</p>}
              {files.map((file) => (
                <a
                  key={file._id}
                  className="file-row text-decoration-none"
                  href={getFileUrl(file)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="fw-semibold text-dark">{file.fileName}</div>
                  <div className="small text-muted">
                    Uploaded by {file.uploadedBy?.name} on {new Date(file.createdAt).toLocaleString()}
                  </div>
                  <div className="small text-muted">
                    {file.fileType || "File"} {file.fileSize ? `• ${(file.fileSize / (1024 * 1024)).toFixed(2)} MB` : ""}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUploadPanel;
