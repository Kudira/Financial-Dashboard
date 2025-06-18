import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

// Register all required components
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  TimeScale,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
);

const CandlestickChart = ({ data, symbol, darkMode }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          No data available for candlestick chart
        </p>
      </div>
    );
  }

  // Format data specifically for candlestick chart
  const chartData = {
    datasets: [{
      label: `${symbol} Price`,
      data: data.map(item => ({
        x: new Date(item.date), // Convert date string to Date object
        o: item.open,
        h: item.high,
        l: item.low,
        c: item.close
      })),
      color: {
        up: darkMode ? '#10B981' : '#059669',   // Green for up
        down: darkMode ? '#EF4444' : '#DC2626', // Red for down
        unchanged: darkMode ? '#9CA3AF' : '#6B7280',
      },
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const data = context.raw;
            return [
              `Open: $${data.o.toFixed(2)}`,
              `High: $${data.h.toFixed(2)}`,
              `Low: $${data.l.toFixed(2)}`,
              `Close: $${data.c.toFixed(2)}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM d, yyyy'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '400px' }}>
      <Chart 
        type="candlestick" 
        data={chartData} 
        options={options} 
      />
    </div>
  );
};

export default CandlestickChart;