import { useState } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]); // Pour stocker les prévisions horaires
  const [error, setError] = useState('');
  const apiKey = '22b5014325d7bb57ebedf7adc4644810'; // Remplace avec ta clé API

  const getWeather = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      
      // Récupérer les prévisions horaires
      const lat = response.data.coord.lat;
      const lon = response.data.coord.lon;
      const hourlyResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setHourly(hourlyResponse.data.list.slice(0, 24)); // Garder uniquement les 24 prochaines heures

    } catch (err) {
      setError('Ville non trouvée');
      setWeather(null);
      setHourly([]);
    }
  };

  return (
    <div className="app">
      <h1>Météo App</h1>
      <form onSubmit={getWeather} className="form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Entrez une ville"
          required
          className="input"
        />
        <button type="submit" className="button">Obtenir la météo</button>
      </form>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-info">
          <h2>Météo à {weather.name}</h2>
          <div className="temperature">
            <i className="fa fa-thermometer-half" aria-hidden="true"></i>
            <span>{weather.main.temp} °C</span>
          </div>
          <p><i className="fa fa-cloud" aria-hidden="true"></i> Conditions: {weather.weather[0].description}</p>
          <p><i className="fa fa-tint" aria-hidden="true"></i> Humidité: {weather.main.humidity}%</p>
          <p><i className="fa fa-wind" aria-hidden="true"></i> Vent: {weather.wind.speed} m/s</p>

          {/* Prévisions horaires */}
          <div className="hourly-forecast">
            <h3>Prévisions horaires</h3>
            <div className="hourly-list">
              {hourly.map((hour, index) => (
                <div key={index} className="hourly-item">
                  <p>{new Date(hour.dt * 1000).getHours()}:00</p>
                  <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt={hour.weather[0].description} />
                  <p>{hour.main.temp} °C</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <button className="refresh-button" onClick={() => window.location.reload()}>Actualiser</button>
    </div>
  );
};

export default App;
