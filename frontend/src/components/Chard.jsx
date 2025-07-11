import React from "react";

export default function Chard({ children }) {
  return (
    <div style={{
      background: "rgba(30,32,42,0.4)",
      backdropFilter: "blur(12px)",
      borderRadius: "1.5rem",
      boxShadow: "0 6px 32px 0 rgba(0,0,0,0.24)",
      border: "1px solid rgba(255,255,255,0.08)",
      padding: "1.5rem",
      marginBottom: "1.5rem"
    }}>
      {children}
    </div>
  );
}
