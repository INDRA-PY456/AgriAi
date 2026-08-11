export const getBestTimeToAct = (forecast, disease) => {
  if (!forecast || forecast.length < 2) return null;
  
  const today = forecast[0];
  const tomorrow = forecast[1];
  
  let bestWindow = { time: 'Today', status: 'Suitable', reason: `Low immediate rainfall risk (${today.rainProbability}%) makes the next few hours suitable for treatment.` };
  let avoidWindow = { time: 'Tomorrow Evening', status: 'Avoid', reason: `Rain probability is high (${tomorrow.rainProbability}%) and rainfall soon after spraying may reduce treatment effectiveness.` };
  
  let todayStatus = today.rainProbability < 40 ? 'Suitable' : (today.rainProbability > 60 ? 'Avoid' : 'Caution');
  let tomorrowMorningStatus = tomorrow.rainProbability > 60 ? 'Avoid' : (tomorrow.rainProbability > 30 ? 'Caution' : 'Suitable');
  let tomorrowEveningStatus = tomorrow.rainProbability > 60 ? 'Avoid' : (tomorrow.rainProbability > 40 ? 'Caution' : 'Suitable');
  
  if (today.rainProbability > 60) {
    bestWindow = { time: 'Tomorrow', status: 'Caution', reason: `High rain probability today (${today.rainProbability}%). Consider waiting.` };
    avoidWindow = { time: 'Today', status: 'Avoid', reason: `Rain probability is high today (${today.rainProbability}%), do not treat now.` };
  } else if (tomorrow.rainProbability > 60) {
    avoidWindow = { time: 'Tomorrow Evening', status: 'Avoid', reason: `Rain probability is high tomorrow (${tomorrow.rainProbability}%) and rainfall soon after spraying may reduce treatment effectiveness.` };
  } else {
     avoidWindow = { time: 'Day 3', status: 'Caution', reason: `Conditions are generally favorable, but monitor weather.`};
  }

  return {
    bestWindow,
    avoidWindow,
    timeline: [
      { time: 'Now', status: todayStatus, color: todayStatus === 'Suitable' ? '#22c55e' : (todayStatus === 'Caution' ? '#f59e0b' : '#ef4444'), icon: todayStatus === 'Suitable' ? '✅' : (todayStatus === 'Caution' ? '⚠️' : '🚫') },
      { time: 'Today Evening', status: todayStatus, color: todayStatus === 'Suitable' ? '#22c55e' : (todayStatus === 'Caution' ? '#f59e0b' : '#ef4444'), icon: todayStatus === 'Suitable' ? '✅' : (todayStatus === 'Caution' ? '⚠️' : '🚫') },
      { time: 'Tomorrow Morning', status: tomorrowMorningStatus, color: tomorrowMorningStatus === 'Suitable' ? '#22c55e' : (tomorrowMorningStatus === 'Caution' ? '#f59e0b' : '#ef4444'), icon: tomorrowMorningStatus === 'Suitable' ? '✅' : (tomorrowMorningStatus === 'Caution' ? '⚠️' : '🚫') },
      { time: 'Tomorrow Evening', status: tomorrowEveningStatus, color: tomorrowEveningStatus === 'Suitable' ? '#22c55e' : (tomorrowEveningStatus === 'Caution' ? '#f59e0b' : '#ef4444'), icon: tomorrowEveningStatus === 'Suitable' ? '✅' : (tomorrowEveningStatus === 'Caution' ? '⚠️' : '🚫') },
      { time: 'Day 3', status: forecast[2] ? (forecast[2].rainProbability > 50 ? 'Avoid' : 'Caution') : 'Caution', color: '#f59e0b', icon: '⚠️' },
    ]
  };
};

export const getWeatherSummaryForDisease = (weather, disease) => {
  if (!weather || !weather.current) return '';
  const h = weather.current.humidity;
  const t = weather.current.temperature;
  const rp = weather.current.rainProbability;
  
  let riskLevel = 'low';
  if (h > 75 && rp > 50) riskLevel = 'high';
  else if (h > 60 || rp > 30) riskLevel = 'moderate';
  
  return `Current humidity of ${h}% and temperatures around ${t}°C create favorable conditions for ${disease || 'fungal diseases'}. With ${rp}% rain probability today, disease spread risk is ${riskLevel}.`;
};
