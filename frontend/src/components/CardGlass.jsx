import React from "react"

export default function CardGlass({ children, style = {}, className = "" }) {
  return (
    <div
      className={`p-3 rounded-4 shadow-sm ${className}`}
      style={{
        background: "rgba(30, 32, 42, 0.44)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 4px 28px 0 rgba(0, 0, 0, 0.09)",
        ...style
      }}
    >
      {children}
    </div>
  )
}
