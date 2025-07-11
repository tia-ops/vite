import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import axios from "axios";
import API_BASE_URL from "./apiConfig";

function App() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/profile.php`, { withCredentials: true })
      .then(res => {
        if (res.data && res.data.role) {
          setAuthed(true);
          setRole(res.data.role); // Perbaikan: Akses role langsung
        }
      })
      .catch(() => {
        setAuthed(false);
        setRole(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogin = (userRole) => {
    setAuthed(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    axios.post(`${API_BASE_URL}/logout.php`, {}, { withCredentials: true })
      .then(() => {
        setAuthed(false);
        setRole(null);
      })
      .catch(console.error);
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#1a2235" }} />;

  return (
    <BrowserRouter>
      {authed && (
        <Sidebar
          authed={authed}
          role={role}
          onLogout={handleLogout}
        />
      )}
      <div
        style={{
          marginLeft: authed ? 250 : 0,
          transition: "margin .22s cubic-bezier(.7,.3,.3,1)",
          minHeight: "100vh",
          background: "linear-gradient(135deg,#161C29 0%,#232b47 100%)"
        }}
      >
        <div style={{ height: authed ? 66 : 0 }} />
        <Routes>
          <Route path="/" element={authed ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/dashboard" element={authed ? <DashboardPage role={role} /> : <Navigate to="/" />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={authed ? <ProfilePage role={role} /> : <Navigate to="/" />} />
          <Route path="/admin" element={authed && role === "admin" ? <AdminPage /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <footer
          className="text-center py-2 text-secondary"
          style={{
            fontSize: 12,
            background: "#121212",
            position: "fixed",
            width: "100%",
            bottom: 0,
            left: authed ? 250 : 0,
            zIndex: 2,
            borderTop: "1px solid #222"
          }}
        >
          &copy; {new Date().getFullYear()} Trader App
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;