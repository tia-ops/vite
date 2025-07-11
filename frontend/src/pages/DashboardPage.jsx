import React, { useEffect, useState, useRef } from "react";
import DropdownSymbols from "../components/DropdownSymbols";
import Card from "../components/Card"; // Ganti ke Card
import API_BASE_URL from "../apiConfig";

export default function DashboardPage({ role }) {
  const [pair, setPair] = useState("BTCUSDT");
  const [data, setData] = useState({
    price: null,
    change: null,
    high: null,
    low: null,
    funding: null,
    ratio: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setErrors({});

    const fetchAPIData = async () => {
      try {
        const endpoints = {
          kline: `${API_BASE_URL}/api/kline.php?symbol=${pair}&interval=1d&limit=1`,
          funding: `${API_BASE_URL}/api/funding.php?symbol=${pair}`,
          ratio: `${API_BASE_URL}/api/longshort.php?symbol=${pair}`,
        };

        const requests = Object.values(endpoints).map(url =>
          fetch(url, { credentials: "include" }).then(res => {
            if (!res.ok) return res.json().then(err => Promise.reject(err));
            return res.json();
          })
        );
        
        const [klineData, fundingData, ratioData] = await Promise.all(requests);

        if (isMounted) {
          setData(prev => ({
            ...prev,
            high: klineData?.[0]?.[2] || null,
            low: klineData?.[0]?.[3] || null,
            funding: fundingData?.[0]?.fundingRate || null,
            ratio: ratioData?.[0]?.longShortRatio ? parseFloat(ratioData[0].longShortRatio) : NaN,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setErrors(prev => ({ ...prev, api: error.error || "Gagal memuat data." }));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAPIData();

    return () => { isMounted = false; };
  }, [pair]);

  useEffect(() => {
    setData(prev => ({ ...prev, price: null, change: null }));

    const socket = new WebSocket(`wss://fstream.binance.com/ws/${pair.toLowerCase()}@trade`);
    
    socket.onmessage = (event) => {
        const trade = JSON.parse(event.data);
        setData(prev => ({ ...prev, price: trade.p }));
    };

    socket.onerror = () => {
        setErrors((prev) => ({ ...prev, websocket: "Koneksi harga realtime gagal." }));
    };

    return () => {
      socket.close();
    };
  }, [pair]);

  const getRatioBars = () => {
    if (errors.api) return <div className="text-danger small">{errors.api}</div>;
    if (isLoading) return <div className="text-secondary small">Memuat rasio...</div>;
    if (isNaN(data.ratio)) return <div className="text-warning small">Rasio tidak tersedia.</div>;
    
    const totalBars = 20;
    const longPercent = Math.max(0, Math.min(1, data.ratio / (data.ratio + 1)));
    const longBars = Math.round(totalBars * longPercent);
    const shortBars = totalBars - longBars;
    
    return (
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, gap: 12 }}>
        <span style={{ color: "#47ffaf" }}>LONG {"█".repeat(longBars)}</span>
        <span style={{ color: "#ff6d6d" }}>SHORT {"█".repeat(shortBars)}</span>
      </div>
    );
  };

  const renderDataPoint = (label, value, errorKey, formatFn) => (
    <div className="d-flex justify-content-between">
      <span>{label}</span>
      {errors[errorKey] ? (
        <span className="text-danger small" style={{maxWidth: '50%', textAlign: 'right'}}>{errors[errorKey]}</span>
      ) : (
        <span>{isLoading ? "..." : (value !== null && value !== undefined ? (formatFn ? formatFn(value) : value) : "N/A")}</span>
      )}
    </div>
  );

  return (
    <div className="container py-4" style={{ maxWidth: 540 }}>
      <Card type="glass"> {/* Menggunakan Card */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <div style={{ maxWidth: 220, minWidth: 120, flex: "1 0 auto" }}>
            <DropdownSymbols value={pair} onSelect={setPair} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1, color: "#ffe8aa", marginLeft: 10, minWidth: 0, flex: "1 1 120px", textAlign: "left", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {errors.websocket ? <span className="text-danger small">{errors.websocket}</span> :
             data.price ? (
                <>
                    <span style={{ color: "#ffd87a", fontWeight: 900 }}>{Number(data.price).toLocaleString()}</span>
                </>
             ) : (
                <span className="text-secondary">Memuat harga...</span>
             )}
          </div>
        </div>
        <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.25)", margin: "10px 0" }}/>
        <div className="d-flex flex-column gap-1 text-light mb-3" style={{ fontSize: 15, fontWeight: 600 }}>
          {renderDataPoint("High (24h)", data.high, "api", (val) => Number(val).toLocaleString())}
          {renderDataPoint("Low (24h)", data.low, "api", (val) => Number(val).toLocaleString())}
          {renderDataPoint("Funding Rate", data.funding, "api", (val) => `${(val * 100).toFixed(4)}%`)}
        </div>
        <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.25)", margin: "10px 0" }}/>
        {getRatioBars()}
      </Card>
    </div>
  );
}