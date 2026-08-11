export function createWeatherForecast(container) {
  const section = document.createElement('div');
  section.className = 'weather-forecast-wrapper';
  section.innerHTML = `
    <div class="weather-forecast hidden" id="forecast-section">
      <h2 class="section-title"><i data-lucide="calendar" style="width:20px;height:20px;"></i> 3-Day Forecast</h2>
      <div class="weather-forecast__days" id="forecast-days">
        <!-- Populated dynamically -->
      </div>
    </div>
  `;
  container.appendChild(section);

  const forecastSection = section.querySelector('#forecast-section');
  const forecastDays = section.querySelector('#forecast-days');

  function update(forecastData) {
    if (!forecastData || !forecastData.forecast) return;
    
    forecastDays.innerHTML = '';
    
    forecastData.forecast.forEach((dayData, index) => {
      const dayEl = document.createElement('div');
      dayEl.className = `weather-forecast__day card animate-fade-in-up delay-${index}`;
      dayEl.innerHTML = `
        <div class="weather-forecast__day-name">${dayData.day}</div>
        <div class="weather-forecast__day-icon">${dayData.icon}</div>
        <div class="weather-forecast__day-temps">
          <span class="weather-forecast__day-high">${dayData.high}°</span>
          <span class="weather-forecast__day-divider">/</span>
          <span class="weather-forecast__day-low">${dayData.low}°</span>
        </div>
        <div class="weather-forecast__day-condition">${dayData.condition}</div>
        <div class="weather-forecast__day-rain">
          <span>🌧️</span> ${dayData.rainProbability}% rain
        </div>
      `;
      forecastDays.appendChild(dayEl);
    });
    
    forecastSection.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }

  function show() { forecastSection.classList.remove('hidden'); }
  function hide() { forecastSection.classList.add('hidden'); }

  return { element: section, update, show, hide };
}
