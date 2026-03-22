import axios from "axios";
import { getApiBaseUrl } from "./config";

const api = axios.create({
  baseURL: getApiBaseUrl()
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("syncSpaceUser"));
  if (user?.token) {
    // Attach the saved JWT so every protected request reaches the API authenticated.
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data)
};

export const projectAPI = {
  create: (data) => api.post("/projects/create", data),
  getUserProjects: () => api.get("/projects/user-projects"),
  join: (data) => api.post("/projects/join", data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  leave: (id) => api.delete(`/projects/${id}/leave`),
  getById: (id) => api.get(`/projects/${id}`),
  getDashboard: () => api.get("/projects/dashboard")
};

export const taskAPI = {
  create: (data) => api.post("/tasks/create", data),
  getAlerts: (projectId) => api.get(`/tasks/alerts/${projectId}`),
  getByProject: (id) => api.get(`/tasks/project/${id}`),
  update: (data) => api.put("/tasks/update", data)
};

export const messageAPI = {
  getByProject: (projectId) => api.get(`/messages/${projectId}`),
  send: (data) => api.post("/messages/send", data)
};

export const codeAPI = {
  getByProject: (projectId) => api.get(`/code/${projectId}`),
  save: (data) => api.post("/code/save", data)
};

export const analyticsAPI = {
  getContributions: (projectId) => api.get(`/analytics/contributions/${projectId}`)
};

export const fileAPI = {
  upload: (formData) =>
    api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  getByProject: (id) => api.get(`/files/project/${id}`)
};

export default api;
