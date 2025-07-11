import React, { useState, useEffect, useRef } from "react"
import axios from "axios"

export default function DropdownSymbols({ value, onSelect }) {
  const [open, setOpen] = useState(false)
  const [symbols, setSymbols] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [error, setError] = useState(null)
  const inputRef = useRef()

  useEffect(() => {
    setLoading(true)
    axios.get("https://fapi.binance.com/fapi/v1/exchangeInfo")
      .then(res => {
        const list = res.data.symbols
          .filter(s => s.contractType === "PERPETUAL")
          .map(s => s.symbol)
          .sort()
        setSymbols(list)
        setLoading(false)
      })
      .catch(() => {
        setError("Gagal fetch simbol Binance!")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
    if (!open) setKeyword("")
  }, [open])

  const filtered = symbols.filter(s => s.toLowerCase().includes(keyword.toLowerCase()))

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      setOpen(false)
      if (onSelect) onSelect(keyword.trim().toUpperCase())
    }
    if (e.key === "Escape") setOpen(false)
  }

  return (
    <div style={{ width: "100%", position: "relative", maxWidth: 180 }}>
      <button
        className="btn btn-outline-success d-flex justify-content-between align-items-center"
        style={{
          borderRadius: 7,
          fontWeight: 700,
          padding: "7px 13px",
          fontSize: 17,
          width: "100%",
          height: 44,
          background: "rgba(26,30,44,0.80)"
        }}
        onClick={() => setOpen(v => !v)}
        type="button"
        tabIndex={0}
      >
        <span style={{
          letterSpacing: 1,
          fontWeight: 700,
          color: "#ffd87a",
          fontSize: 17
        }}>
          {value || "Pilih…"}
        </span>
        <span style={{ fontSize: 18, color: "#aaa", marginLeft: 9 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 48,
            width: "100%",
            zIndex: 1001,
            background: "rgba(28,32,54,0.99)",
            borderRadius: 10,
            marginTop: 3,
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.13)",
            border: "1px solid #23263a",
            padding: 8
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="form-control mb-2"
            placeholder="Ketik simbol…"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={handleInputKeyDown}
            style={{
              borderRadius: 7,
              background: "#181b2c",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              border: "1px solid #25254a"
            }}
          />
          <div style={{ maxHeight: 160, overflowY: "auto" }}>
            {loading && <div className="text-secondary py-2">Loading…</div>}
            {error && <div className="text-danger py-2">{error}</div>}
            {filtered.length === 0 && !loading && !error && (
              <div className="text-secondary py-2">Tidak ada simbol</div>
            )}
            {filtered.map(sym => (
              <button
                key={sym}
                className="btn btn-sm w-100 btn-outline-light mb-1 text-nowrap"
                style={{
                  borderRadius: 7,
                  fontWeight: 700,
                  letterSpacing: 1,
                  fontSize: 16,
                  textAlign: "left"
                }}
                onClick={() => {
                  setOpen(false)
                  if (onSelect) onSelect(sym)
                }}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      )}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 900
          }}
        />
      )}
    </div>
  )
}
