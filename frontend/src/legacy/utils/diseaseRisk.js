export const calculateDiseaseRisk = (weather, disease) => {
  if (!weather || !weather.forecast) return [];
  
  return weather.forecast.map(dayForecast => {
    let score = 30;
    let factors = [];
    
    // Using current weather for today's forecast if available, else use forecast values
    const humidity = dayForecast.day === 'Today' && weather.current ? weather.current.humidity : 70; // fallback humidity
    const temp = dayForecast.day === 'Today' && weather.current ? weather.current.temperature : dayForecast.high;
    const wind = dayForecast.day === 'Today' && weather.current ? weather.current.wind : 15; // fallback wind
    const rain = dayForecast.rainProbability;
    
    if (humidity > 75) {
      score += 20;
      factors.push(`Humidity at ${humidity}%`);
    } else if (humidity > 60) {
      score += 10;
      factors.push(`Humidity at ${humidity}%`);
    }
    
    if (rain > 60) {
      score += 25;
      factors.push(`Rain probability ${rain}%`);
    } else if (rain > 40) {
      score += 15;
      factors.push(`Rain probability ${rain}%`);
    } else if (rain > 20) {
      score += 5;
      factors.push(`Rain probability ${rain}%`);
    }
    
    if (temp >= 25 && temp <= 32) {
      score += 10;
      factors.push(`Temperatures favorable for fungal growth`);
    }
    
    if (wind < 10) {
      score += 5;
      factors.push(`Low wind speed reduces air circulation`);
    }
    
    if (disease && disease.toLowerCase().includes('early blight')) {
      score += 5;
    }
    
    let level, color, emoji;
    if (score <= 40) {
      level = 'Low';
      color = '#22c55e';
      emoji = '🟢';
    } else if (score <= 60) {
      level = 'Moderate';
      color = '#f59e0b';
      emoji = '🟡';
    } else if (score <= 75) {
      level = 'Elevated';
      color = '#f97316';
      emoji = '🟠';
    } else {
      level = 'High';
      color = '#ef4444';
      emoji = '🔴';
    }
    
    return {
      day: dayForecast.day,
      level,
      color,
      emoji,
      score: Math.min(score, 100),
      factors
    };
  });
};
