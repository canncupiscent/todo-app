import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(false);
  const [inputCity, setInputCity] = useState(''); // Removed separate city state

  const fetchWeather = async (currentCity) => { // Removed default city
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${API_KEY}&units=metric`;

    try {
      setLoading(true);
      const response = await axios.get(URL);
      setWeather(response.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(true);
      setLoading(false);
    }
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim() !== '') {
      fetchWeather(inputCity.trim());
      setInputCity('');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleCitySubmit} className="flex items-center mb-4">
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-l-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
          placeholder="Enter city"
        />
        <button
          type="submit"
          className="bg-blue-500 dark:bg-blue-700 text-white p-2 rounded-r-xl hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors flex items-center justify-center"
        >
          <FiSearch size={24} /> {/* Increased icon size to match the search bar height */}
        </button>
      </form>

      {loading && <div className="text-gray-500 dark:text-gray-300">Loading weather...</div>}
      {error && <div className="text-red-500">Error fetching weather data. Please try again.</div>}

      {weather && !loading && !error && (
        <div className="flex items-center space-x-2">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="w-8 h-8"
          />
          <div className="text-sm text-gray-700 dark:text-gray-200">
            {weather.name}: {Math.round(weather.main.temp)}°C, {weather.weather[0].description}
          </div>
          <button onClick={() => fetchWeather(weather.name)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
            <FiRefreshCw />
          </button>
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;