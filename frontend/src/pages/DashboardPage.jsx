import React, { useEffect, useState, useCallback } from "react";
import DropdownSymbols from "../components/DropdownSymbols";
import Card from "../components/Card";
import Chart from "../components/Chart";
import API_BASE_URL from "../apiConfig";

export default function DashboardPage({ role }) {
  const [pair, setPair] = useState("BTCUSDT");
  const [data, setData] = useState({
    price: null,
    high: null,
    low: null,
    funding: null,
    ratio: null,
  });
  const [chartData, setChartData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data kline
  const fetchKlineData = useCallback(async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/kline.php?symbol=${pair}&interval=1d&limit=30`,
      { credentials: "include" }
    );
    
    if (!response.ok) {
      throw new Error(`Kline data error: ${response.status}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid kline data format');
    }
    
    return data;
  }, [pair]);

  // Fungsi untuk mengambil data funding rate
  const fetchFundingData = useCallback(async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/funding.php?symbol=${pair}`,
      { credentials: "include" }
    );
    
    if (!response.ok) {
      throw new Error(`Funding rate error: ${response.status}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    
    return data[0]?.fundingRate || null;
  }, [pair]);

  // Fungsi untuk mengambil data ratio
  const fetchRatioData = useCallback(async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/longshort.php?symbol=${pair}`,
      { credentials: "include" }
    );
    
    if (!response.ok) {
      throw new Error(`Long/Short ratio error: ${response.status}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    
    return data[0]?.longShortRatio ? parseFloat(data[0].longShortRatio) : null;
  }, [pair]);

  // Effect untuk mengambil semua data
  useEffect(() => {
    let isMounted = true;
    
    const fetchAllData = async () => {
      setIsLoading(true);
      setErrors({});

      try {
        const [klineData, fundingRate, ratio] = await Promise.all([
          fetchKlineData(),
          fetchFundingData(),
          fetchRatioData()
        ]);

        if (!isMounted) return;

        // Update chart data
        const formattedChartData = klineData.map(candle => ({
          time: Math.floor(Number(candle[0]) / 1000),
          open: Number(candle[1]),
          high: Number(candle[2]),
          low: Number(candle[3]),
          close: Number(candle[4])
        }));

        setChartData(formattedChartData);

        // Update price data
        setData(prev => ({
          ...prev,
          high: klineData[klineData.length - 1][2],
          low: klineData[klineData.length - 1][3],
          funding: fundingRate,
          ratio: ratio
        }));

      } catch (error) {
        console.error('Data fetch error:', error);
        if (isMounted) {
          setErrors(prev => ({
            ...prev,
            api: error.message || "Failed to load data"
          }));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAllData();

    // WebSocket connection untuk real-time price
    const wsUrl = `wss://fstream.binance.com/ws/${pair.toLowerCase()}@trade`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log(`WebSocket connected: ${wsUrl}`);
    };

    ws.onmessage = (event) => {
      if (!isMounted) return;
      try {
        const trade = JSON.parse(event.data);
        setData(prev => ({ ...prev, price: trade.p }));
      } catch (error) {
        console.error('WebSocket parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (isMounted) {
        setErrors(prev => ({
          ...prev,
          websocket: "Real-time connection failed"
        }));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup function
    return () => {
      isMounted = false;
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [pair, fetchKlineData, fetchFundingData, fetchRatioData]);

  // Format number with proper decimals
  const formatNumber = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getRatioBars = () => {
    if (errors.api) return <div className="text-danger small">{errors.api}</div>;
    if (isLoading) return <div className="text-secondary small">Loading ratio...</div>;
    if (isNaN(data.ratio)) return <div className="text-warning small">Ratio unavailable</div>;

    const longPercent = Math.max(0, Math.min(1, data.ratio / (data.ratio + 1)));
    const longPercentDisplay = Math.round(longPercent * 100);
    const shortPercentDisplay = 100 - longPercentDisplay;
    
    return (
      <div style={{ fontSize: 14, color: '#d1d4dc' }}>
        <div className="d-flex justify-content-between mb-2" style={{ fontWeight: 600 }}>
          <span>Global Long/Short Ratio</span>
          <span>{data.ratio ? data.ratio.toFixed(2) : 'N/A'}</span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '24px',
          background: 'rgba(26,30,44,0.5)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex'
        }}>
          <div style={{
            width: `${longPercentDisplay}%`,
            background: '#47ffaf',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0a2817',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'width 0.3s ease'
          }}>
            {longPercentDisplay}%
          </div>
          <div style={{
            width: `${shortPercentDisplay}%`,
            background: '#ff6d6d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2a1215',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'width 0.3s ease'
          }}>
            {shortPercentDisplay}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4" style={{ maxWidth: 540 }}>
      <Card type="glass">
        <div className="d-flex align-items-center gap-3 mb-4">
          <DropdownSymbols value={pair} onSelect={setPair} />
          <div className="d-flex align-items-baseline">
            {errors.websocket ? (
              <span className="text-danger small">{errors.websocket}</span>
            ) : data.price ? (
              <>
                <span style={{ 
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#ffd87a",
                  letterSpacing: 0.5,
                  marginLeft: 8
                }}>
                  {formatNumber(data.price)}
                </span>
                <span style={{ 
                  fontSize: 13, 
                  color: 'rgba(255,255,255,0.5)', 
                  fontWeight: 600,
                  marginLeft: 6
                }}>USDT</span>
              </>
            ) : (
              <span className="text-secondary ms-2">Loading price...</span>
            )}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(26,30,44,0.3)',
          borderRadius: 12,
          padding: '16px',
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>24h High</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#47ffaf' }}>
                {formatNumber(data.high)}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>24h Low</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#ff6d6d' }}>
                {formatNumber(data.low)}
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Funding Rate</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#ffd87a' }}>
              {data.funding ? `${(data.funding * 100).toFixed(4)}%` : 'N/A'}
            </div>
          </div>
        </div>

        {getRatioBars()}

        <div className="mt-3">
          <Card type="glass">
            <Chart data={chartData} />
          </Card>
        </div>
      </Card>
    </div>
  );
}