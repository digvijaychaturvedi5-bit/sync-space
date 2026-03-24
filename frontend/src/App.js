import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatSectionPage from "./pages/ChatSectionPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import DashboardPage from "./pages/DashboardPage";
import FileManagerPage from "./pages/FileManagerPage";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import ProjectWorkspacePage from "./pages/ProjectWorkspacePage";
import RegisterPage from "./pages/RegisterPage";
import TaskBoardPage from "./pages/TaskBoardPage";
import ContributionDashboard from "./pages/ContributionDashboard";
import { useStoredUser } from "./services/authStorage";

function App() {
  const user = useStoredUser();

  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route
          path="/dashboard"
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
