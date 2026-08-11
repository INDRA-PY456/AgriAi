import { demoWeatherData } from '../data/demoWeather.js';

/**
 * Demo implementation. Should be replaced with a real weather API.
 */
export const getWeather = (locationName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = demoWeatherData[locationName] || demoWeatherData['Vijayawada'];
      resolve({ current: data.current, forecast: data.forecast });
    }, 400);
  });
};

/**
 * Convenience function, returns just the forecast array.
 * Should be replaced with a real weather API.
 */
export const getForecast = (locationName) => {
  return getWeather(locationName).then((data) => data.forecast);
};
