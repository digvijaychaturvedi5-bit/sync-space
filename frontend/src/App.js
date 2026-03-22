import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatSectionPage from "./pages/ChatSectionPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import DashboardPage from "./pages/DashboardPage";
import FileManagerPage from "./pages/FileManagerPage";
import LoginPage from "./pages/LoginPage";
import ProjectWorkspacePage from "./pages/ProjectWorkspacePage";
import RegisterPage from "./pages/RegisterPage";
import TaskBoardPage from "./pages/TaskBoardPage";
import ContributionDashboard from "./pages/ContributionDashboard";

function App() {
  const user = JSON.parse(localStorage.getItem("syncSpaceUser"));

  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectWorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id/tasks"
          element={
            <ProtectedRoute>
              <TaskBoardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id/files"
          element={
            <ProtectedRoute>
              <FileManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id/chat"
          element={
            <ProtectedRoute>
              <ChatSectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id/code"
          element={
            <ProtectedRoute>
              <CodeEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id/contributions"
          element={
            <ProtectedRoute>
              <ContributionDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
