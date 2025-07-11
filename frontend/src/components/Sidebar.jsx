import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ authed, role, onLogout }) {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const location = useLocation();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) setShow(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Judul header dinamis
  let headerTitle = "Trader App";
  if (role === "admin") headerTitle = "Dashboard Admin";
  if (role === "user") headerTitle = "Dashboard Trader";
  if (location.pathname === "/profile") headerTitle += " • Profil";
  if (location.pathname === "/admin") headerTitle += " • Admin";

  // Sidebar + header glass style
  const sidebarStyle = {
    background: "rgba(30,32,42,0.6)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 6px 32px 0 rgba(0,0,0,0.28)",
    border: "1.5px solid rgba(255,255,255,0.09)",
    borderRadius: isMobile ? "0 20px 20px 0" : "0 32px 32px 0",
    minHeight: "100vh",
    width: isMobile ? 235 : 250,
    position: isMobile ? "fixed" : "fixed",
    left: isMobile ? (show ? 0 : -300) : 0,
    top: 0,
    zIndex: 1052,
    padding: 0,
    transition: "left .22s cubic-bezier(.7,.3,.3,1)",
    display: "flex",
    flexDirection: "column"
  };

  const headerBoxStyle = {
    background: "rgba(25,26,36,0.77)",
    borderBottom: "1.5px solid rgba(255,255,255,0.11)",
    borderRadius: isMobile ? "0 20px 0 0" : "0 32px 0 0",
    padding: "18px 20px 10px 20px",
    textAlign: "left",
    fontWeight: 800,
    fontSize: 20,
    color: "#ffcc44",
    letterSpacing: 1.5,
    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
    position: "relative"
  };

  const menuBoxStyle = {
    flex: 1,
    padding: "26px 14px 20px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  return (
    <>
      {isMobile && (
        <button
          className="btn btn-dark"
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1200,
            borderRadius: 14,
            fontSize: 24,
            padding: "6px 14px"
          }}
          onClick={() => setShow(true)}
        >
          ☰
        </button>
      )}

      <div style={sidebarStyle}>
        <div style={headerBoxStyle}>
          {headerTitle}
          {isMobile && (
            <button
              className="btn btn-sm btn-secondary"
              style={{ position: "absolute", right: 12, top: 12, borderRadius: 10 }}
              onClick={() => setShow(false)}
            >×</button>
          )}
        </div>
        <div style={menuBoxStyle}>
          <Link to="/profile" className={`btn w-100 mb-1 ${location.pathname === "/profile" ? "btn-primary" : "btn-outline-primary"}`}>Profile</Link>
          {role === "admin" && (
            <Link to="/admin" className={`btn w-100 mb-1 ${location.pathname === "/admin" ? "btn-warning" : "btn-outline-warning"}`}>Admin</Link>
          )}
          <button className="btn btn-outline-danger w-100 mb-2" onClick={onLogout}>Logout</button>
        </div>
      </div>
      {/* Overlay untuk mobile */}
      {isMobile && show && (
        <div
          style={{
            position: "fixed",
            left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(40,40,40,0.14)", zIndex: 1049
          }}
          onClick={() => setShow(false)}
        />
      )}
    </>
  );
}
