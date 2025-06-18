import { useState } from 'react';
import { useFinancialData } from './hooks/useFinancialData';
import { FiSearch, FiTrendingUp, FiDollarSign, FiBarChart2, FiMoon, FiSun } from 'react-icons/fi';
import StockChart from './components/StockChart';
import CandlestickChart from './components/CandlestickChart';

function App() {
  const [symbols, setSymbols] = useState(['IBM', 'AAPL']);
  const [activeSymbol, setActiveSymbol] = useState('IBM');
  const [darkMode, setDarkMode] = useState(false);
  const { data, loading, error } = useFinancialData(activeSymbol);

  const handleSearch = (e) => {
    e.preventDefault();
    const newSymbol = e.target.elements.symbol.value.trim().toUpperCase();
    if (!newSymbol) return;
    
    // Don't add to symbols list until we confirm it's valid
    setActiveSymbol(newSymbol);
    e.target.reset();
  };

  // Only show symbols that have data or are loading
  const validSymbols = symbols.filter(sym => 
    sym === activeSymbol || data.length > 0
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with dark mode toggle */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">💰 Financial Dashboard</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Visualize stock market data in real-time</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </header>

        {/* Search and symbol selector */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              name="symbol"
              placeholder="Search (e.g., AAPL, MSFT, BTC-USD)"
              className={`flex-1 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiSearch /> Search
            </button>
          </form>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {validSymbols.map((symbol) => (
              <button
                key={symbol}
                onClick={() => setActiveSymbol(symbol)}
                className={`px-4 py-2 rounded-lg transition-colors min-w-fit ${activeSymbol === symbol 
                  ? 'bg-blue-600 text-white' 
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display - Shows prominently at top */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'}`}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Stats Cards - Only show if we have valid data */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <FiTrendingUp className="text-green-500 text-2xl" />
                <div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Current Price</p>
                  <p className="text-xl font-bold">${data[0].close.toFixed(2)}</p>
                </div>
              </div>
            </div>
            {/* Other stat cards... */}
              {/* Today's High Card */}
    <div className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <FiBarChart2 className="text-blue-500 text-2xl" />
        <div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Today's High</p>
          <p className="text-xl font-bold">${data[0].high.toFixed(2)}</p>
        </div>
      </div>
    </div>

    {/* Today's Low Card */}
    <div className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <FiBarChart2 className="text-red-500 text-2xl" />
        <div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Today's Low</p>
          <p className="text-xl font-bold">${data[0].low.toFixed(2)}</p>
        </div>
      </div>
    </div>

    {/* Volume Card */}
    <div className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <FiDollarSign className="text-purple-500 text-2xl" />
        <div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Volume</p>
          <p className="text-xl font-bold">{data[0].volume.toLocaleString()}</p>
        </div>
      </div>
    </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Line Chart</h2>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : data.length > 0 ? (
              <StockChart data={data} symbol={activeSymbol} darkMode={darkMode} />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {error ? 'Failed to load data' : 'No data available'}
                </p>
              </div>
            )}
          </div>

          {/* Candlestick Chart */}
          <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Candlestick Chart</h2>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : data.length > 0 ? (
              <CandlestickChart data={data} symbol={activeSymbol} darkMode={darkMode} />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {error ? 'Failed to load data' : 'No data available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;