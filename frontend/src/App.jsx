import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [authed, setAuthed] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={authed ? <Navigate to="/profile" /> : <LoginPage onLogin={() => setAuthed(true)} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={authed ? <ProfilePage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
