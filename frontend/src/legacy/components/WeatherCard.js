export function createWeatherCard(container) {
  const section = document.createElement('div');
  section.className = 'weather-card-wrapper';
  section.innerHTML = `
    <div class="weather-card card hidden" id="weather-section">
      <div class="weather-card__header">
        <div>
          <h2 class="section-title"><i data-lucide="cloud-sun" style="width:20px;height:20px;"></i> Current Weather</h2>
          <p class="weather-card__location" id="weather-location">--</p>
        </div>
        <span class="weather-card__icon" id="weather-icon">--</span>
      </div>
      <div class="weather-card__main">
        <div class="weather-card__temp" id="weather-temp">--°C</div>
        <div class="weather-card__condition" id="weather-condition">--</div>
      </div>
      <div class="weather-card__details">
        <div class="weather-card__detail">
          <span>💧</span>
          <div>
            <div class="weather-card__detail-label">Humidity</div>
            <div class="weather-card__detail-value" id="weather-humidity">--%</div>
          </div>
        </div>
        <div class="weather-card__detail">
          <span>💨</span>
          <div>
            <div class="weather-card__detail-label">Wind</div>
            <div class="weather-card__detail-value" id="weather-wind">-- km/h</div>
          </div>
        </div>
        <div class="weather-card__detail">
          <span>🌧️</span>
          <div>
            <div class="weather-card__detail-label">Rain Probability</div>
            <div class="weather-card__detail-value" id="weather-rain">--%</div>
          </div>
        </div>
        <div class="weather-card__detail">
          <span>🌡️</span>
          <div>
            <div class="weather-card__detail-label">Feels Like</div>
            <div class="weather-card__detail-value" id="weather-feels">--°C</div>
          </div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(section);

  const weatherSection = section.querySelector('#weather-section');
  const locEl = section.querySelector('#weather-location');
  const iconEl = section.querySelector('#weather-icon');
  const tempEl = section.querySelector('#weather-temp');
  const condEl = section.querySelector('#weather-condition');
  const humEl = section.querySelector('#weather-humidity');
  const windEl = section.querySelector('#weather-wind');
  const rainEl = section.querySelector('#weather-rain');
  const feelsEl = section.querySelector('#weather-feels');

  function update(weatherData) {
    if (!weatherData || !weatherData.current) return;
    
    const current = weatherData.current;
    
    locEl.textContent = weatherData.locationName || '--';
    iconEl.textContent = current.icon || '🌤️';
    tempEl.textContent = `${current.temperature}°C`;
    condEl.textContent = current.condition || '--';
    humEl.textContent = `${current.humidity}%`;
    windEl.textContent = `${current.wind} km/h`;
    rainEl.textContent = `${current.rainProbability}%`;
    feelsEl.textContent = `${(current.temperature + 1).toFixed(1)}°C`;
    
    weatherSection.classList.remove('hidden');
    weatherSection.classList.add('animate-fade-in-up');
    if (window.lucide) lucide.createIcons();
  }

  function show() { weatherSection.classList.remove('hidden'); }
  function hide() { weatherSection.classList.add('hidden'); }

  return { element: section, update, show, hide };
}
