import React from 'react';
import { createChart } from 'lightweight-charts';

const ChartCard = ({ children }) => {
  const isLargeScreen = window.innerWidth >= 768;
  return (
    <div style={{
      background: 'rgba(30, 34, 45, 0.95)',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      width: isLargeScreen ? '100%' : '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {children}
    </div>
  );
};

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.chartContainerRef = React.createRef();
    this.chart = null;
    this.series = null;
    this.supportResistanceLines = [];
    this.state = {
      isLargeScreen: window.innerWidth >= 768
    };
    
    this.timeframes = [
      { value: "3m", label: "3M" },
      { value: "5m", label: "5M" },
      { value: "15m", label: "15M" },
      { value: "1h", label: "1H" },
      { value: "4h", label: "4H" },
      { value: "12h", label: "12H" },
      { value: "1d", label: "1D" },
    ];
  }

  // Detect support and resistance levels using improved price action analysis
  detectSupportResistance = (data) => {
    if (!data || data.length < 30) return []; // Minimal data untuk analisis yang baik

    const pivotPoints = [];
    const levels = new Map();
    
    // Parameters untuk deteksi yang lebih akurat
    const sensitivity = 0.002; // 0.2% threshold untuk level proximity
    const requiredTouches = 3; // Minimal 3 kali test level
    const lookbackPeriod = 5; // Jumlah candle untuk konfirmasi pivot
    const volumeWeight = true; // Mempertimbangkan volume dalam analisis
    
    // Normalisasi harga untuk perhitungan relatif
    const priceRange = {
      min: Math.min(...data.map(d => d.low)),
      max: Math.max(...data.map(d => d.high))
    };
    const rangeMagnitude = priceRange.max - priceRange.min;

    // Mencari swing high/low points
    for (let i = lookbackPeriod; i < data.length - lookbackPeriod; i++) {
      const currentCandle = data[i];
      const leftCandles = data.slice(i - lookbackPeriod, i);
      const rightCandles = data.slice(i + 1, i + lookbackPeriod + 1);

      // Deteksi Resistance (Swing High)
      if (this.isSwingHigh(currentCandle, leftCandles, rightCandles)) {
        const strength = this.calculatePivotStrength(currentCandle, data, 'resistance');
        pivotPoints.push({
          price: currentCandle.high,
          type: 'resistance',
          time: currentCandle.time,
          strength: strength
        });
      }

      // Deteksi Support (Swing Low)
      if (this.isSwingLow(currentCandle, leftCandles, rightCandles)) {
        const strength = this.calculatePivotStrength(currentCandle, data, 'support');
        pivotPoints.push({
          price: currentCandle.low,
          type: 'support',
          time: currentCandle.time,
          strength: strength
        });
      }
    }

    // Cluster analysis untuk mengelompokkan level yang berdekatan
    pivotPoints.forEach(pivot => {
      let nearestLevel = null;
      let minDistance = Infinity;

      // Cari level terdekat yang sudah ada
      for (const [level] of levels.entries()) {
        const distance = Math.abs(pivot.price - level) / rangeMagnitude;
        if (distance < sensitivity && distance < minDistance) {
          nearestLevel = level;
          minDistance = distance;
        }
      }

      if (nearestLevel !== null) {
        // Update existing level
        const existingData = levels.get(nearestLevel);
        levels.set(nearestLevel, {
          touches: existingData.touches + 1,
          strength: existingData.strength + pivot.strength,
          type: pivot.type,
          lastTouch: pivot.time
        });
      } else {
        // Create new level
        levels.set(pivot.price, {
          touches: 1,
          strength: pivot.strength,
          type: pivot.type,
          lastTouch: pivot.time
        });
      }
    });

    // Filter dan sort levels berdasarkan significance
    const significantLevels = Array.from(levels.entries())
      .filter(([_, data]) => data.touches >= requiredTouches)
      .map(([price, data]) => ({
        price,
        strength: data.strength / data.touches, // Normalize strength
        type: this.determineLevelType(price, data.type, this.props.data),
        touches: data.touches,
        lastTouch: data.lastTouch
      }))
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 8); // Keep top 8 strongest levels

    return significantLevels;
  };

  // Helper untuk mendeteksi swing high
  isSwingHigh = (current, leftCandles, rightCandles) => {
    const isHigherThanLeft = leftCandles.every(c => current.high > c.high);
    const isHigherThanRight = rightCandles.every(c => current.high > c.high);
    return isHigherThanLeft && isHigherThanRight;
  };

  // Helper untuk mendeteksi swing low
  isSwingLow = (current, leftCandles, rightCandles) => {
    const isLowerThanLeft = leftCandles.every(c => current.low < c.low);
    const isLowerThanRight = rightCandles.every(c => current.low < c.low);
    return isLowerThanLeft && isLowerThanRight;
  };

  // Menghitung kekuatan level berdasarkan berbagai faktor
  calculatePivotStrength = (candle, allData, type) => {
    let strength = 1;
    
    // Factor 1: Price rejection (wick length)
    const wickLength = type === 'resistance' 
      ? (candle.high - Math.max(candle.open, candle.close)) / candle.high
      : (Math.min(candle.open, candle.close) - candle.low) / candle.low;
    strength += wickLength * 2;

    // Factor 2: Candle size
    const candleSize = Math.abs(candle.close - candle.open) / candle.open;
    strength += candleSize;

    // Factor 3: Recent tests of the level
    const recentCandles = allData.slice(-20);
    const nearbyPrice = type === 'resistance' ? candle.high : candle.low;
    const tests = recentCandles.filter(c => 
      Math.abs(c.high - nearbyPrice) / nearbyPrice < 0.003 ||
      Math.abs(c.low - nearbyPrice) / nearbyPrice < 0.003
    ).length;
    strength += tests * 0.5;

    return strength;
  };

  // Menentukan apakah level bertindak sebagai support atau resistance
  determineLevelType = (price, historicalType, currentData) => {
    if (!currentData || currentData.length === 0) return historicalType;
    
    const currentPrice = currentData[currentData.length - 1].close;
    const recentCandles = currentData.slice(-10);
    const touches = recentCandles.filter(c => 
      Math.abs(c.high - price) / price < 0.003 ||
      Math.abs(c.low - price) / price < 0.003
    ).length;

    // Jika level baru-baru ini ditest beberapa kali, pertahankan tipe historisnya
    if (touches >= 2) return historicalType;

    // Jika tidak, tentukan berdasarkan posisi harga saat ini
    return currentPrice > price ? 'support' : 'resistance';
  };

  // Draw support and resistance lines with improved visualization
  drawSupportResistance = (levels) => {
    // Clear existing lines
    this.supportResistanceLines.forEach(line => {
      this.chart.removePriceLine(line);
    });
    this.supportResistanceLines = [];

    // Draw new lines with improved styling
    levels.forEach(level => {
      const isSupport = level.type === 'support';
      const baseColor = isSupport ? '#47ffaf' : '#ff6d6d';
      const opacity = Math.min(0.3 + (level.strength * 0.1), 0.8);
      
      const line = this.series.createPriceLine({
        price: level.price,
        color: baseColor + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
        lineWidth: Math.min(1 + Math.floor(level.strength / 2), 3),
        lineStyle: level.touches >= 4 ? 0 : 2, // Solid for very strong levels
        axisLabelVisible: true,
        title: `${level.type === 'support' ? 'S' : 'R'}${level.touches}`,
      });

      this.supportResistanceLines.push(line);
    });
  };

  handleTimeframeClick = (tf) => {
    if (this.props.onTimeframeChange) {
      this.props.onTimeframeChange(tf);
    }
  };

  componentDidMount() {
    this.createChart();
    window.addEventListener('resize', this.handleScreenResize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || prevProps.timeframe !== this.props.timeframe) {
      if (this.series) {
        this.series.setData([]);
        requestAnimationFrame(() => {
          this.series.setData(this.props.data);
          const levels = this.detectSupportResistance(this.props.data);
          this.drawSupportResistance(levels);
          if (this.chart) {
            this.chart.timeScale().fitContent();
          }
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.remove();
    }
    window.removeEventListener('resize', this.handleScreenResize);
  }

  handleScreenResize = () => {
    // Force rerender of ChartCard when screen size changes
    this.forceUpdate();
    if (this.chart && this.chartContainerRef.current) {
      this.chart.applyOptions({
        width: this.chartContainerRef.current.clientWidth,
      });
    }
  };

  createChart = () => {
    if (!this.chartContainerRef.current) return;

    if (this.chart) {
      this.chart.remove();
    }

    this.chart = createChart(this.chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#d1d4dc',
      },
      width: this.chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: 'rgba(67, 70, 81, 0.3)' },
        horzLines: { color: 'rgba(67, 70, 81, 0.3)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: 'rgba(255, 216, 122, 0.2)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#ffd87a',
        },
        horzLine: {
          color: 'rgba(255, 216, 122, 0.2)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#ffd87a',
        },
      },
      timeScale: {
        borderColor: 'rgba(67, 70, 81, 0.5)',
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(67, 70, 81, 0.5)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
    });

    this.series = this.chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    if (this.props.data && this.props.data.length > 0) {
      this.series.setData(this.props.data);
      const levels = this.detectSupportResistance(this.props.data);
      this.drawSupportResistance(levels);
      this.chart.timeScale().fitContent();
    }

    const handleResize = () => {
      if (this.chart && this.chartContainerRef.current) {
        this.chart.applyOptions({
          width: this.chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    this.handleResize = handleResize;
  };

  render() {
    return (
      <ChartCard>
        <div ref={this.chartRef} style={{ position: 'relative', width: '100%', height: '400px' }}>
          {/* Timeframe Selector */}
          <div style={{
            position: 'absolute',
            top: '0px',
            right: '60px',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'row',
            background: 'rgba(30, 34, 45, 0.85)',
            borderRadius: '0 0 6px 6px',
            padding: '2px 4px',
            gap: '1px',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
          }}>
            {this.timeframes.map(tf => (
              <button
                key={tf.value}
                onClick={() => this.handleTimeframeClick(tf.value)}
                style={{
                  background: this.props.timeframe === tf.value ? 'rgba(255,216,122,0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  color: this.props.timeframe === tf.value ? '#ffd87a' : '#858ca2',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '28px',
                  textAlign: 'center',
                  outline: 'none',
                  letterSpacing: '0.2px'
                }}
                onMouseEnter={(e) => {
                  if (this.props.timeframe !== tf.value) {
                    e.target.style.background = 'rgba(255,216,122,0.05)';
                    e.target.style.color = '#a5aab6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (this.props.timeframe !== tf.value) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#858ca2';
                  }
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>
          
          {/* Chart Container */}
          <div 
            ref={this.chartContainerRef} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </div>
      </ChartCard>
    );
  }
}

export default Chart;