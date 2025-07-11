import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import './Sidebar.css'; 

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function Sidebar({ isOpen, onClose, onLogout, role }) {
  const location = useLocation();

  useEffect(() => {
    // Menutup sidebar setiap kali pindah halaman
    onClose();
  }, [location]);

  // Mencegah body di-scroll saat sidebar terbuka di mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Trader App</h3>
          <button className="sidebar-close-button" onClick={onClose} aria-label="Close sidebar">
            <CloseIcon />
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/profile" className="nav-link">Profil</Link>
          {role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
          <button onClick={onLogout} className="nav-link logout-button">Logout</button>
        </nav>
      </aside>
    </>
  );
}