import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const StockChart = ({ data, symbol, darkMode }) => {
     if (!data || data.length === 0) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          Loading chart data...
        </p>
      </div>
    );
  }
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: `${symbol} Closing Price`,
        data: data.map((item) => item.close),
        borderColor: darkMode ? 'rgb(16, 185, 129)' : 'rgb(59, 130, 246)',
        backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#E5E7EB' : '#111827',
        }
      },
      title: {
        display: true,
        text: `${symbol} Closing Prices`,
        font: {
          size: 16
        },
        color: darkMode ? '#E5E7EB' : '#111827',
      },
    },
    scales: {
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
        }
      },
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
        }
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default StockChart;