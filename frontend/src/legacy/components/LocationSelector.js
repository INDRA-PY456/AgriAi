import { getCurrentLocation, geocodeLocation } from '../utils/locationService.js';

export function createLocationSelector(container) {
  const section = document.createElement('div');
  section.className = 'location-selector-wrapper';
  section.innerHTML = `
    <div class="location-selector">
      <div class="card">
        <h2 class="section-title"><i data-lucide="map-pin" style="width:20px;height:20px;"></i> Select Location</h2>
        <p class="section-subtitle">Choose your farm location to get local weather and advisory</p>
        <div class="location-selector__tabs">
          <button class="location-selector__tab active" data-tab="geo"><i data-lucide="radar" style="width:14px;height:14px;"></i> Use My Location</button>
          <button class="location-selector__tab" data-tab="manual"><i data-lucide="pencil" style="width:14px;height:14px;"></i> Enter Location</button>
        </div>
        <div class="location-selector__content">
          <div class="location-selector__geo" id="geo-tab">
            <button class="btn btn--primary location-selector__geo-btn" id="geo-btn">
              <i data-lucide="map-pin" style="width:16px;height:16px;"></i> Use My Current Location
            </button>
            <p class="location-selector__geo-hint">We'll request your browser's location permission</p>
          </div>
          <div class="location-selector__manual hidden" id="manual-tab">
            <div class="location-selector__input-group">
              <input type="text" class="location-selector__input" id="location-input" 
                     placeholder="Enter your location (e.g., Vijayawada, Andhra Pradesh)">
              <button class="btn btn--primary" id="set-location-btn">Set Location</button>
            </div>
          </div>
        </div>
        <div class="location-selector__result hidden" id="location-result">
          <span class="location-selector__result-icon"><i data-lucide="map-pin" style="width:20px;height:20px;color:var(--color-primary);"></i></span>
          <div class="location-selector__result-info">
            <div class="location-selector__result-name" id="result-name"></div>
            <div class="location-selector__result-coords" id="result-coords"></div>
          </div>
          <button class="btn btn--secondary btn--icon" id="change-location-btn" title="Change location"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
        </div>
      </div>
    </div>
  `;
  container.appendChild(section);
  if (window.lucide) lucide.createIcons();

  const tabs = section.querySelectorAll('.location-selector__tab');
  const geoTab = section.querySelector('#geo-tab');
  const manualTab = section.querySelector('#manual-tab');
  const geoBtn = section.querySelector('#geo-btn');
  const locationInput = section.querySelector('#location-input');
  const setLocationBtn = section.querySelector('#set-location-btn');
  const locationResult = section.querySelector('#location-result');
  const resultName = section.querySelector('#result-name');
  const resultCoords = section.querySelector('#result-coords');
  const changeLocationBtn = section.querySelector('#change-location-btn');
  const contentArea = section.querySelector('.location-selector__content');

  function showToast(message, type) {
    document.dispatchEvent(new CustomEvent('agriai:toast', { detail: { message, type } }));
  }

  function handleLocationSuccess(locationData) {
    resultName.textContent = `${locationData.name}, ${locationData.region || ''}, ${locationData.country || ''}`.replace(/, ,/g, ',').replace(/,\s*$/, '');
    resultCoords.textContent = `${locationData.lat.toFixed(4)}°N, ${locationData.lng.toFixed(4)}°E`;
    contentArea.classList.add('hidden');
    locationResult.classList.remove('hidden');
    document.dispatchEvent(new CustomEvent('agriai:location-selected', { detail: locationData }));
    showToast('Location updated successfully', 'success');
    if (window.lucide) lucide.createIcons();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      if (tab.dataset.tab === 'geo') {
        geoTab.classList.remove('hidden');
        manualTab.classList.add('hidden');
      } else {
        geoTab.classList.add('hidden');
        manualTab.classList.remove('hidden');
      }
    });
  });

  geoBtn.addEventListener('click', async () => {
    const originalText = geoBtn.innerHTML;
    geoBtn.innerHTML = '<span class="loading-spinner"></span> Locating...';
    geoBtn.disabled = true;
    
    try {
      const locationData = await getCurrentLocation();
      handleLocationSuccess(locationData);
    } catch (error) {
      showToast(error.message || 'Failed to get location', 'error');
    } finally {
      geoBtn.innerHTML = originalText;
      geoBtn.disabled = false;
    }
  });

  async function handleManualLocation() {
    const query = locationInput.value.trim();
    if (!query) {
      showToast('Please enter a location', 'warning');
      return;
    }
    
    const originalText = setLocationBtn.innerHTML;
    setLocationBtn.innerHTML = '<span class="loading-spinner"></span>';
    setLocationBtn.disabled = true;
    
    try {
      const locationData = await geocodeLocation(query);
      handleLocationSuccess(locationData);
    } catch (error) {
      showToast(error.message || 'Location not found', 'error');
    } finally {
      setLocationBtn.innerHTML = originalText;
      setLocationBtn.disabled = false;
    }
  }

  setLocationBtn.addEventListener('click', handleManualLocation);
  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleManualLocation();
  });

  changeLocationBtn.addEventListener('click', () => {
    locationResult.classList.add('hidden');
    contentArea.classList.remove('hidden');
  });

  function update(data) {
    if (data && data.location) {
      handleLocationSuccess(data.location);
    }
  }

  function show() { section.classList.remove('hidden'); }
  function hide() { section.classList.add('hidden'); }

  return { element: section, update, show, hide };
}
