import { useState, useEffect } from 'react';

export const useFinancialData = (symbol = 'IBM') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setData([]); // Clear previous data
        
        const API_KEY = 'Y1QSGX9GEK8V00WOA'; // Your API key
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Network error - failed to fetch data');
        }
        
        const result = await response.json();
        
        // Handle different error responses
        if (result['Error Message']) {
          throw new Error(`Invalid stock symbol: ${symbol}`);
        }
        
        if (result.Note && result.Note.includes('API call frequency')) {
          throw new Error('API rate limit reached - try again in 1 minute');
        }

        const timeSeries = result['Time Series (Daily)'];
        if (!timeSeries || Object.keys(timeSeries).length === 0) {
          throw new Error(`No market data available for ${symbol}`);
        }

        // Format successful response
        const formattedData = Object.entries(timeSeries)
          .slice(0, 30) // Get last 30 days
          .map(([date, values]) => ({
            date,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume'])
          }))
          .reverse(); // Newest first

        setData(formattedData);
      } catch (err) {
        setError(err.message);
        setData([]); // Ensure no data is shown for errors
        console.error('API Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  return { data, loading, error };
};