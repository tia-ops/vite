import React from 'react';
import './Header.css';

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export default function Header({ onToggleSidebar, role }) {
  return (
    <header className="app-header">
      <button className="header-toggle-button" onClick={onToggleSidebar} aria-label="Open sidebar">
        <MenuIcon />
      </button>
      <div className="header-title">
        {role === 'admin' ? "Dashboard Admin" : "Dashboard Trader"}
      </div>
    </header>
  );
}