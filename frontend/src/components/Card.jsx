import React from "react";

const cardStyles = {
  glass: {
    background: "rgba(30, 32, 42, 0.44)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  chard: {
    background: "rgba(30,32,42,0.4)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
};

export default function Card({ children, type = "glass", style = {}, className = "" }) {
  const baseStyle = {
    padding: "1.5rem",
    borderRadius: "1.5rem",
    boxShadow: "0 6px 32px 0 rgba(0,0,0,0.24)",
    marginBottom: "1.5rem",
    maxWidth: 360,
  };

  const combinedStyle = { ...baseStyle, ...cardStyles[type], ...style };

  return (
    <div className={`p-3 ${className}`} style={combinedStyle}>
      {children}
    </div>
  );
}