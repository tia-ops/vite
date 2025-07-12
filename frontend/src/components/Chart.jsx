import React from 'react';
import { createChart } from 'lightweight-charts';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.chart = null;
    this.series = null;
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data && this.series) {
      this.series.setData(this.props.data);
      if (this.chart) {
        // Adjust view to fit the new data
        this.chart.timeScale().fitContent();
      }
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.remove();
    }
  }

  createChart = () => {
    if (!this.chartRef.current) return;

    if (this.chart) {
      this.chart.remove();
    }

    this.chart = createChart(this.chartRef.current, {
      width: this.chartRef.current.clientWidth,
      height: 300,
      layout: {
        backgroundColor: '#161a1e',
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          color: '#334158',
        },
      },
      crosshair: {
        mode: 1,
      },
      priceScale: {
        borderColor: '#485c7b',
      },
      timeScale: {
        borderColor: '#485c7b',
        timeVisible: true,
      },
    });

    this.series = this.chart.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });

    if (this.props.data && this.props.data.length > 0) {
      this.series.setData(this.props.data);
    }

    // Handle resize
    const handleResize = () => {
      if (this.chart && this.chartRef.current) {
        this.chart.applyOptions({
          width: this.chartRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    this.handleResize = handleResize; // Save for cleanup
  };

  render() {
    return (
      <div
        ref={this.chartRef}
        style={{
          width: '100%',
          height: '300px',
        }}
      />
    );
  }
}

export default Chart;