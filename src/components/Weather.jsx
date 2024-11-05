// src/components/Weather.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Get user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        setError("Unable to retrieve your location", error);
      }
    );
  }, []);

  // Fetch weather data from Open-Meteo
  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        try {
          const { latitude, longitude } = location;
          const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          setWeather(response.data.current_weather);
        } catch (err) {
          setError("Failed to retrieve weather data");
        }
      };
      fetchWeather();
    }
  }, [location]);

  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      {weather ? (
        <div style={styles.weatherBox}>
          <h1 style={styles.title}>Weather at Your Location</h1>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windspeed} km/h</p>
          <p>Condition: {weather.weathercode}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#e0f7fa',
    color: '#00796b',
    fontFamily: 'Arial, sans-serif',
  },
  weatherBox: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#00796b',
  },
};

export default Weather;
