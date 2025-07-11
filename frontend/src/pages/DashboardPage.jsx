import React, { useEffect, useState, useRef } from "react"
import DropdownSymbols from "../components/DropdownSymbols"
import CardGlass from "../components/CardGlass"

export default function DashboardPage({ role }) {
  const [pair, setPair] = useState("BTCUSDT")
  const [price, setPrice] = useState(null)
  const [change, setChange] = useState(null)
  const [high, setHigh] = useState(null)
  const [low, setLow] = useState(null)
  const [funding, setFunding] = useState(null)
  const [ratio, setRatio] = useState(null)
  const ws = useRef(null)

  useEffect(() => {
    let stop = false
    setChange(null)
    setHigh(null)
    setLow(null)
    setFunding(null)
    setRatio(null)

    fetch(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${pair}`)
      .then(res => res.json())
      .then(data => {
        if (!stop) {
          setChange(data.priceChangePercent)
          setHigh(data.highPrice)
          setLow(data.lowPrice)
        }
      })

    fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${pair}`)
      .then(res => res.json())
      .then(data => {
        if (!stop) {
          setFunding(data.lastFundingRate)
        }
      })

    fetch(`https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${pair}&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (!stop && data && data.length > 0) {
          const ratioValue = parseFloat(data[0].longShortRatio)
          if (!isNaN(ratioValue)) setRatio(ratioValue)
        }
      })
      .catch(() => setRatio(NaN))

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

  const getRatioBars = () => {
    if (ratio === null) return <div className="text-secondary">Memuat rasio global…</div>
    if (isNaN(ratio)) return <div className="text-warning">Rasio tidak tersedia untuk simbol ini.</div>
    const totalBars = 20
    const longPercent = Math.min(ratio / (1 + ratio), 1)
    const longBars = Math.round(totalBars * longPercent)
    const shortBars = totalBars - longBars
    const longVisual = "█".repeat(longBars)
    const shortVisual = "█".repeat(shortBars)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 15,
          fontWeight: 600,
          gap: 12
        }}
      >
        <span style={{ color: "#47ffaf" }}>LONG {longVisual}</span>
        <span style={{ color: "#ff6d6d" }}>SHORT {shortVisual}</span>
      </div>
    )
  }

  return (
    <div className="container py-4" style={{ maxWidth: 540 }}>
      <CardGlass>
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
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

        <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.25)", margin: "10px 0" }} />

        <div className="d-flex flex-column gap-1 text-light mb-3" style={{ fontSize: 15, fontWeight: 600 }}>
          <div className="d-flex justify-content-between">
            <span>High (24h)</span>
            <span>{high ? Number(high).toLocaleString() : "—"}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Low (24h)</span>
            <span>{low ? Number(low).toLocaleString() : "—"}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Funding Rate</span>
            <span>{funding ? `${(funding * 100).toFixed(4)}%` : "—"}</span>
          </div>
        </div>

        <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.25)", margin: "10px 0" }} />

        {getRatioBars()}
      </CardGlass>
    </div>
  )
}
