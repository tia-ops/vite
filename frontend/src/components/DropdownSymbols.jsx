import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";

export default function DropdownSymbols({ value, onSelect }) {
  const [open, setOpen] = useState(false);
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef();
  const dropdownRef = useRef();

  // Fetch symbols
  useEffect(() => {
    const fetchSymbols = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://sinyalrmb.net/backend/api/symbols.php", { 
          withCredentials: true 
        });
        
        if (response.data?.symbols) {
          const list = response.data.symbols
            .filter(s => s.contractType === "PERPETUAL")
            .map(s => s.symbol)
            .sort();
          setSymbols(list);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Symbol fetch error:", err);
        setError("Failed to load symbols");
      } finally {
        setLoading(false);
      }
    };

    fetchSymbols();
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setKeyword("");
    }
  }, [open]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Filtered symbols with memo
  const filtered = useMemo(() => {
    const search = keyword.toLowerCase().trim();
    return symbols.filter(s => s.toLowerCase().includes(search));
  }, [symbols, keyword]);

  // Keyboard navigation
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      setOpen(false);
      onSelect?.(keyword.trim().toUpperCase());
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="symbol-dropdown" style={{ 
      width: "100%", 
      position: "relative",
      maxWidth: 180 
    }}>
      <button
        className="symbol-button"
        style={{
          width: "100%",
          height: 44,
          padding: "7px 16px",
          background: "rgba(26,30,44,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.2s ease",
          position: "relative",
          overflow: "hidden"
        }}
        onClick={() => setOpen(v => !v)}
        type="button"
      >
        <span style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#ffd87a",
          letterSpacing: 1,
          flexGrow: 1,
          textAlign: "left",
          marginRight: 8
        }}>
          {value || "Select..."}
        </span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.6
          }}
        >
          <path 
            fill="currentColor" 
            d="M8 10L3 5h10l-5 5z"
          />
        </svg>
      </button>

      {open && (
        <div
          className="symbol-dropdown-menu"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 4px)",
            background: "rgba(28,32,54,0.98)",
            backdropFilter: "blur(10px)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            padding: 8,
            zIndex: 1000,
            animation: "dropdownFade 0.2s ease"
          }}
        >
          <div className="search-container" style={{ marginBottom: 8 }}>
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search symbol..."
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(24,27,44,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                outline: "none",
                transition: "border-color 0.2s ease"
              }}
            />
          </div>

          <div style={{ 
            maxHeight: 240,
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#666 transparent"
          }}>
            {loading && (
              <div style={{ 
                padding: "12px 8px",
                color: "rgba(255,255,255,0.6)",
                textAlign: "center"
              }}>
                Loading symbols...
              </div>
            )}

            {error && (
              <div style={{ 
                padding: "12px 8px",
                color: "#ff6b6b",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div style={{ 
                padding: "12px 8px",
                color: "rgba(255,255,255,0.6)",
                textAlign: "center"
              }}>
                No symbols found
              </div>
            )}

            {filtered.map(symbol => (
              <button
                key={symbol}
                onClick={() => {
                  setOpen(false);
                  onSelect?.(symbol);
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "block",
                  margin: "2px 0",
                  ":hover": {
                    background: "rgba(255,255,255,0.1)"
                  }
                }}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .symbol-dropdown button:hover {
          background: rgba(26,30,44,1);
          border-color: rgba(255,255,255,0.15);
        }
        
        .symbol-dropdown input:focus {
          border-color: #ffd87a;
        }
        
        .symbol-dropdown-menu button:hover {
          background: rgba(255,255,255,0.1);
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scrollbar Styles */
        .symbol-dropdown-menu > div::-webkit-scrollbar {
          width: 6px;
        }

        .symbol-dropdown-menu > div::-webkit-scrollbar-track {
          background: transparent;
        }

        .symbol-dropdown-menu > div::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
