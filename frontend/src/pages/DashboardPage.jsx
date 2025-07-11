import React, { useEffect, useState, useRef } from "react"
import DropdownSymbols from "../components/DropdownSymbols"

export default function DashboardPage({ role }) {
  const [pair, setPair] = useState("BTCUSDT")
  const [price, setPrice] = useState(null)
  const [change, setChange] = useState(null)
  const ws = useRef(null)

  useEffect(() => {
    let stop = false
    setChange(null)
    fetch(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${pair}`)
      .then(res => res.json())
      .then(data => {
        if (!stop) setChange(data.priceChangePercent)
      })
    return () => { stop = true }
  }, [pair])

  useEffect(() => {
    if (ws.current) ws.current.close()
    setPrice(null)
    ws.current = new window.WebSocket(
      `wss://fstream.binance.com/ws/${pair.toLowerCase()}@trade`
    )
    ws.current.onmessage = (e) => {
      const obj = JSON.parse(e.data)
      setPrice(obj.p)
    }
    return () => { if (ws.current) ws.current.close() }
  }, [pair])

  return (
    <div className="container py-4" style={{ maxWidth: 540 }}>
      <div
        className="d-flex flex-wrap align-items-center gap-2 mb-4"
        style={{
          background: "rgba(30,32,42,0.44)",
          borderRadius: 14,
          padding: "15px 20px",
          boxShadow: "0 4px 28px 0 rgba(0,0,0,0.09)",
          backdropFilter: "blur(8px)"
        }}
      >
        <div style={{ maxWidth: 220, minWidth: 120, flex: "1 0 auto" }}>
          <DropdownSymbols value={pair} onSelect={setPair} />
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#ffe8aa",
            marginLeft: 10,
            minWidth: 0,
            flex: "1 1 120px",
            textAlign: "left",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
          }}
        >
          <span style={{ color: "#ffd87a", fontWeight: 900 }}>
            {price ? Number(price).toLocaleString() : <span className="text-secondary">Loading...</span>}
          </span>
          <span style={{ fontSize: 15, marginLeft: 12 }}>
            {change !== null &&
              <span style={{ color: change > 0 ? "#47ffaf" : "#ff6d6d" }}>
                ({change > 0 && "+"}{Number(change).toFixed(2)}%)
              </span>
            }
          </span>
        </div>
      </div>
    </div>
  )
}
