import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import './App.css'; 

function App() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Cek otentikasi
  useEffect(() => {
    axios.get(`${API_BASE_URL}/profile.php`, { withCredentials: true })
      .then(res => {
        if (res.data && res.data.role) {
          setAuthed(true);
          setRole(res.data.role);
        }
      })
      .catch(() => {
        setAuthed(false);
        setRole(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = (userRole) => {
    setAuthed(true);
    setRole(userRole);
  };

  const handleLogout = useCallback(() => {
    axios.post(`${API_BASE_URL}/logout.php`, {}, { withCredentials: true })
      .then(() => {
        setAuthed(false);
        setRole(null);
        window.location.href = "/";
      })
      .catch(console.error);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  if (loading) {
    return <div className="app-loading-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      {authed && (
        <>
          <Header onToggleSidebar={toggleSidebar} role={role} />
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar} 
            onLogout={handleLogout} 
            role={role}
          />
        </>
      )}
      <main className="main-content">
        <Routes>
          {authed ? (
            <>
              <Route path="/dashboard" element={<DashboardPage role={role} />} />
              <Route path="/profile" element={<ProfilePage role={role} />} />
              {role === 'admin' && <Route path="/admin" element={<AdminPage />} />}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;