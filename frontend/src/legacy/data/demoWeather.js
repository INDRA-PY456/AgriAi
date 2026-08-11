export const demoWeatherData = {
  'Vijayawada': {
    current: {
      temperature: 31,
      condition: 'Partly Cloudy',
      humidity: 78,
      wind: 12,
      rainProbability: 35,
      icon: '⛅',
    },
    forecast: [
      { day: 'Today', high: 31, low: 25, rainProbability: 35, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Tomorrow', high: 29, low: 24, rainProbability: 70, condition: 'Rain', icon: '🌧️' },
      { day: 'Day 3', high: 30, low: 24, rainProbability: 45, condition: 'Showers', icon: '🌦️' },
    ]
  },
  'Hyderabad': {
    current: {
      temperature: 29,
      condition: 'Mostly Sunny',
      humidity: 70,
      wind: 8,
      rainProbability: 25,
      icon: '🌤️',
    },
    forecast: [
      { day: 'Today', high: 29, low: 23, rainProbability: 25, condition: 'Mostly Sunny', icon: '🌤️' },
      { day: 'Tomorrow', high: 28, low: 22, rainProbability: 40, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Day 3', high: 30, low: 23, rainProbability: 30, condition: 'Sunny', icon: '☀️' },
    ]
  },
  'Visakhapatnam': {
    current: {
      temperature: 30,
      condition: 'Humid & Cloudy',
      humidity: 82,
      wind: 18,
      rainProbability: 60,
      icon: '🌥️',
    },
    forecast: [
      { day: 'Today', high: 30, low: 26, rainProbability: 60, condition: 'Humid & Cloudy', icon: '🌥️' },
      { day: 'Tomorrow', high: 29, low: 25, rainProbability: 80, condition: 'Thunderstorms', icon: '⛈️' },
      { day: 'Day 3', high: 28, low: 24, rainProbability: 55, condition: 'Rain', icon: '🌧️' },
    ]
  }
};
