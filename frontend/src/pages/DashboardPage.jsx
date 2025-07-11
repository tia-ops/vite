import React, { useEffect, useState, useRef } from "react";
import DropdownSymbols from "../components/DropdownSymbols";
import CardGlass from "../components/CardGlass";
import API_BASE_URL from "../apiConfig";

export default function DashboardPage({ role }) {
  const [pair, setPair] = useState("BTCUSDT");
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [high, setHigh] = useState(null);
  const [low, setLow] = useState(null);
  const [funding, setFunding] = useState(null);
  const [ratio, setRatio] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    setErrors({});
    setHigh(null);
    setLow(null);
    setFunding(null);
    setRatio(null);

    const fetchAPI = async (endpoint, params, onSuccess, errorKey) => {
      const query = new URLSearchParams(params).toString();
      try {
        const response = await fetch(`${API_BASE_URL}/api/${endpoint}?${query}`, {
          credentials: "include",
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (isMounted) onSuccess(data);
      } catch (error) {
        if (isMounted) setErrors((prev) => ({ ...prev, [errorKey]: error.message }));
      }
    };

    fetchAPI( "kline.php", { symbol: pair, interval: "1d", limit: "1" },
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHigh(data[0][2]);
          setLow(data[0][3]);
        }
      }, "kline"
    );

    fetchAPI( "funding.php", { symbol: pair },
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFunding(data[0].fundingRate);
        }
      }, "funding"
    );

    fetchAPI( "longshort.php", { symbol: pair },
      (data) => {
        const ratioValue = data && data.length > 0 ? parseFloat(data[0].longShortRatio) : NaN;
        setRatio(isNaN(ratioValue) ? NaN : ratioValue);
      }, "ratio"
    );

    return () => { isMounted = false; };
  }, [pair]);

  useEffect(() => {
    setPrice(null);
    
    const socket = new WebSocket(`wss://fstream.binance.com/ws/${pair.toLowerCase()}@trade`);

    socket.onmessage = (e) => {
      setPrice(JSON.parse(e.data).p);
    };

    socket.onerror = () => {
      if (socket.readyState !== WebSocket.CLOSED) {
        setErrors((prev) => ({ ...prev, websocket: "Koneksi harga realtime gagal." }));
      }
    };
    
    return () => {
      socket.close();
    };
  }, [pair]);

  const getRatioBars = () => {
    if (errors.ratio) return <div className="text-danger small">{errors.ratio}</div>;
    if (ratio === null) return <div className="text-secondary small">Memuat rasio...</div>;
    if (isNaN(ratio)) return <div className="text-warning small">Rasio tidak tersedia.</div>;
    
    const totalBars = 20;
    const longPercent = Math.max(0, Math.min(1, ratio / (ratio + 1)));
    const longBars = Math.round(totalBars * longPercent);
    const shortBars = totalBars - longBars;
    const longVisual = "█".repeat(longBars);
    const shortVisual = "█".repeat(shortBars);
    
    return (
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, gap: 12 }}>
        <span style={{ color: "#47ffaf" }}>LONG {longVisual}</span>
        <span style={{ color: "#ff6d6d" }}>SHORT {shortVisual}</span>
      </div>
    );
  };

  const renderDataPoint = (label, value, errorKey, formatFn) => (
    <div className="d-flex justify-content-between">
      <span>{label}</span>
      {errors[errorKey] ? (
        <span className="text-danger small" style={{maxWidth: '50%', textAlign: 'right'}}>{errors[errorKey]}</span>
      ) : (
        <span>{value !== null ? (formatFn ? formatFn(value) : value) : "..."}</span>
      )}
    </div>
  );

  return (
    <div className="container py-4" style={{ maxWidth: 540 }}>
      <CardGlass>
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <div style={{ maxWidth: 220, minWidth: 120, flex: "1 0 auto" }}>
            <DropdownSymbols value={pair} onSelect={setPair} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1, color: "#ffe8aa", marginLeft: 10, minWidth: 0, flex: "1 1 120px", textAlign: "left", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {errors.websocket ? <span className="text-danger small">{errors.websocket}</span> :
             price ? (
                <>
                    <span style={{ color: "#ffd87a", fontWeight: 900 }}>{Number(price).toLocaleString()}</span>
                    {change !== null && (
                        <span style={{ fontSize: 15, marginLeft: 12, color: change > 0 ? "#47ffaf" : "#ff6d6d" }}>
                            ({change > 0 && "+"}{Number(change).toFixed(2)}%)
                        </span>
                    )}
                </>
             ) : (
                <span className="text-secondary">Memuat harga...</span>
             )}
          </div>
        </div>
        <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.25)", margin: "10px 0" }}/>
        <div className="d-flex flex-column gap-1 text-light mb-3" style={{ fontSize: 15, fontWeight: 600 }}>
          {renderDataPoint("High (24h)", high, "kline", (val) => Number(val).toLocaleString())}
          {renderDataPoint("Low (24h)", low, "kline", (val) => Number(val).toLocaleString())}
          {renderDataPoint("Funding Rate", funding, "funding", (val) => `${(val * 100).toFixed(4)}%`)}
        </div>
        <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.25)", margin: "10px 0" }}/>
        {getRatioBars()}
      </CardGlass>
    </div>
  );
}