import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Thermometer,
  Eye,
  Wind,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
} from 'lucide-react';
import './WeatherApp.css';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState(false);

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return <Sun className="weather-icon" />;
      case 'clouds':
        return <Cloud className="weather-icon" />;
      case 'rain':
        return <CloudRain className="weather-icon" />;
      case 'snow':
        return <CloudSnow className="weather-icon" />;
      case 'thunderstorm':
        return <Zap className="weather-icon" />;
      default:
        return <Sun className="weather-icon" />;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError('');
    try {
      const apiKey = "f183b6fe7e41c95d03350eb99b6fa9d2"; 
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      console.log(data);
      setWeather(data);
      setCurrentLocation(false);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };
  useEffect(()=>{
        handleSearch("city");
  },[city])

  return (
    <div className="weather-app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            <Thermometer className="title-icon" />
            Weather Now
          </h1>
        </header>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="search-input"
              disabled={loading}
            />
            <button type="submit" className="search-button" disabled={loading}>
              <Search className="search-icon" />
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Getting weather data...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => setError('')} className="dismiss-button">
              Dismiss
            </button>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-card">
            <div className="weather-header">
              <div className="location">
                <MapPin className="location-icon" />
                <h2 className="city-name">{weather.name}</h2>
                {currentLocation && (
                  <p className="current-location">📍 Your Location</p>
                )}
              </div>
            </div>

            <div className="weather-main">
              {getWeatherIcon(weather.weather[0]?.main)}
              <div className="temperature">
                {Math.round(weather.main.temp)}°C
              </div>
            </div>

            <div className="weather-description">
              <p>{weather.weather[0]?.description}</p>
              <p>
                Feels like {Math.round(weather.main.feels_like)}°C
              </p>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <Droplets className="detail-icon" />
                <div>
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">
                    {weather.main.humidity}%
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <Wind className="detail-icon" />
                <div>
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">
                    {weather.wind.speed} m/s
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <Eye className="detail-icon" />
                <div>
                  <span className="detail-label">Visibility</span>
                  <span className="detail-value">
                    {(weather.visibility / 1000).toFixed(1)} km
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <Thermometer className="detail-icon" />
                <div>
                  <span className="detail-label">Pressure</span>
                  <span className="detail-value">
                    {weather.main.pressure} hPa
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
