import './style.css';

// Import components
import { createToastSystem } from './components/Toast.js';
import { createNavbar } from './components/Navbar.js';
import { createImageUploader } from './components/ImageUploader.js';
import { createLocationSelector } from './components/LocationSelector.js';
import { createWeatherCard } from './components/WeatherCard.js';
import { createWeatherForecast } from './components/WeatherForecast.js';
import { createCropAnalysis } from './components/CropAnalysis.js';
import { createDiseaseInfo } from './components/DiseaseInfo.js';
import { createDiseaseRisk } from './components/DiseaseRisk.js';
import { createRecommendations } from './components/RecommendationCard.js';
import { createActionTimeline } from './components/ActionTimeline.js';
import { createHealthScore } from './components/HealthScore.js';

// Import services
import { getWeather } from './utils/weatherService.js';
import { analyzeCrop, calculateHealthScore } from './utils/cropAnalyzer.js';

// Application State
const state = {
  image: null,
  location: null,
  weather: null,
  analysis: null,
  healthScore: null,
  isAnalyzing: false,
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // Create background agriculture icons
  const bgIcons = document.createElement('div');
  bgIcons.className = 'bg-icons';
  const bgIconList = [
    { icon: '🌿', top: '8%', left: '5%', size: '2rem' },
    { icon: '🌱', top: '15%', left: '88%', size: '1.6rem' },
    { icon: '💧', top: '28%', left: '3%', size: '1.4rem' },
    { icon: '☀️', top: '12%', left: '75%', size: '1.8rem' },
    { icon: '🌾', top: '45%', left: '92%', size: '2rem' },
    { icon: '🍃', top: '55%', left: '4%', size: '1.5rem' },
    { icon: '🌻', top: '65%', left: '90%', size: '1.7rem' },
    { icon: '🌤️', top: '35%', left: '95%', size: '1.4rem' },
    { icon: '💨', top: '75%', left: '6%', size: '1.3rem' },
    { icon: '🌧️', top: '82%', left: '85%', size: '1.5rem' },
    { icon: '🪴', top: '50%', left: '2%', size: '1.6rem' },
    { icon: '🌍', top: '90%', left: '8%', size: '1.4rem' },
    { icon: '🌳', top: '20%', left: '93%', size: '1.8rem' },
    { icon: '🌸', top: '70%', left: '88%', size: '1.3rem' },
  ];
  bgIconList.forEach(({ icon, top, left, size }) => {
    const el = document.createElement('span');
    el.className = 'bg-icon';
    el.textContent = icon;
    el.style.top = top;
    el.style.left = left;
    el.style.fontSize = size;
    bgIcons.appendChild(el);
  });
  document.body.appendChild(bgIcons);

  // Auto-initialize Lucide icons on DOM changes
  let lucideTimeout;
  const lucideObserver = new MutationObserver(() => {
    clearTimeout(lucideTimeout);
    lucideTimeout = setTimeout(() => {
      if (window.lucide) lucide.createIcons();
    }, 50);
  });
  lucideObserver.observe(app, { childList: true, subtree: true });
  if (window.lucide) lucide.createIcons();
  
  // Create toast container
  const toastContainer = document.getElementById('toast-container') || (() => {
    const tc = document.createElement('div');
    tc.id = 'toast-container';
    tc.className = 'toast-container';
    document.body.appendChild(tc);
    return tc;
  })();
  const toastSystem = createToastSystem(toastContainer);
  
  // Convenience toast methods
  const toast = {
    success: (msg) => toastSystem.showToast(msg, 'success'),
    error: (msg) => toastSystem.showToast(msg, 'error'),
    warning: (msg) => toastSystem.showToast(msg, 'warning'),
    info: (msg) => toastSystem.showToast(msg, 'info'),
  };
  
  // Navbar
  const navbar = createNavbar(app);
  
  // Welcome section
  const welcomeSection = document.createElement('section');
  welcomeSection.className = 'welcome container';
  welcomeSection.innerHTML = `
    <h1 class="welcome__greeting animate-fade-in">Welcome back, Farmer 👋</h1>
    <p class="welcome__subtitle animate-fade-in delay-1">Upload a crop image and select your location to get AI-powered advisory</p>
  `;
  app.appendChild(welcomeSection);
  
  // Main content container
  const mainContainer = document.createElement('main');
  mainContainer.className = 'container';
  app.appendChild(mainContainer);
  
  // Top section: image upload left, location + weather right
  const dashboardTop = document.createElement('div');
  dashboardTop.className = 'dashboard-top dashboard-section';
  mainContainer.appendChild(dashboardTop);
  
  const imageUploaderContainer = document.createElement('div');
  const dashboardRight = document.createElement('div');
  dashboardRight.className = 'dashboard-right';
  dashboardTop.appendChild(imageUploaderContainer);
  dashboardTop.appendChild(dashboardRight);
  
  const imageUploader = createImageUploader(imageUploaderContainer);
  const locationSelectorContainer = document.createElement('div');
  dashboardRight.appendChild(locationSelectorContainer);
  const locationSelector = createLocationSelector(locationSelectorContainer);
  
  // Summary Cards Section
  const summaryCardsContainer = document.createElement('div');
  summaryCardsContainer.className = 'summary-cards hidden';
  
  const createSummaryCard = (id, icon, label) => `
    <div class="summary-card card">
      <div class="summary-card__icon">${icon}</div>
      <div>
        <div class="summary-card__label">${label}</div>
        <div class="summary-card__value" id="${id}">--</div>
      </div>
    </div>
  `;
  
  summaryCardsContainer.innerHTML = `
    ${createSummaryCard('summary-temp', '🌡️', 'Temperature')}
    ${createSummaryCard('summary-disease', '🦠', 'Disease')}
    ${createSummaryCard('summary-confidence', '📊', 'AI Confidence')}
    ${createSummaryCard('summary-health', '🏥', 'Health Score')}
  `;
  dashboardRight.appendChild(summaryCardsContainer);
  
  // Weather Sections
  const weatherRow = document.createElement('div');
  weatherRow.className = 'grid-2 hidden dashboard-section weather-section';
  dashboardRight.appendChild(weatherRow);
  
  const weatherCardContainer = document.createElement('div');
  const weatherForecastContainer = document.createElement('div');
  weatherRow.appendChild(weatherCardContainer);
  weatherRow.appendChild(weatherForecastContainer);
  
  const weatherCard = createWeatherCard(weatherCardContainer);
  const weatherForecast = createWeatherForecast(weatherForecastContainer);
  
  // Crop Analysis Section
  const cropAnalysisContainer = document.createElement('div');
  cropAnalysisContainer.className = 'dashboard-section';
  mainContainer.appendChild(cropAnalysisContainer);
  const cropAnalysis = createCropAnalysis(cropAnalysisContainer);
  
  // Disease Info & Risk Row
  const diseaseRow = document.createElement('div');
  diseaseRow.className = 'grid-2 hidden dashboard-section';
  mainContainer.appendChild(diseaseRow);
  
  const diseaseInfoContainer = document.createElement('div');
  const diseaseRiskContainer = document.createElement('div');
  diseaseRow.appendChild(diseaseInfoContainer);
  diseaseRow.appendChild(diseaseRiskContainer);
  
  const diseaseInfo = createDiseaseInfo(diseaseInfoContainer);
  const diseaseRisk = createDiseaseRisk(diseaseRiskContainer);
  
  // Recommendations Section
  const recommendationsContainer = document.createElement('div');
  recommendationsContainer.className = 'dashboard-section';
  mainContainer.appendChild(recommendationsContainer);
  const recommendations = createRecommendations(recommendationsContainer);
  
  // Action Timeline & Health Score Row
  const finalRow = document.createElement('div');
  finalRow.className = 'grid-2 hidden dashboard-section';
  mainContainer.appendChild(finalRow);
  
  const actionTimelineContainer = document.createElement('div');
  const healthScoreContainer = document.createElement('div');
  finalRow.appendChild(actionTimelineContainer);
  finalRow.appendChild(healthScoreContainer);
  
  const actionTimeline = createActionTimeline(actionTimelineContainer);
  const healthScore = createHealthScore(healthScoreContainer);
  
  // Footer
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer__brand">
        <i data-lucide="leaf" style="width:18px;height:18px;"></i>
        AgriAI - AI-powered crop health & weather advisory
      </div>
      <p class="footer__disclaimer">For educational and advisory purposes. Always consult local agricultural experts.</p>
    </div>
  `;
  app.appendChild(footer);

  // Update Summary Cards Helper
  const updateSummaryCards = () => {
    if (state.weather && state.weather.current) {
      document.getElementById('summary-temp').textContent = `${state.weather.current.temperature}°C`;
    }
    if (state.analysis) {
      document.getElementById('summary-disease').textContent = state.analysis.disease;
      document.getElementById('summary-confidence').textContent = `${state.analysis.confidence}%`;
    }
    if (state.healthScore) {
      document.getElementById('summary-health').textContent = `${state.healthScore.overall}/100`;
    }
  };

  // Event Listeners
  document.addEventListener('agriai:image-uploaded', (e) => {
    state.image = e.detail;
  });

  document.addEventListener('agriai:image-removed', () => {
    state.image = null;
    state.analysis = null;
    cropAnalysis.hide();
    diseaseRow.classList.add('hidden');
    recommendations.hide();
    finalRow.classList.add('hidden');
    summaryCardsContainer.classList.add('hidden');
    if (imageUploader.update) imageUploader.update({ analyzed: false, analyzing: false });
  });

  document.addEventListener('agriai:location-selected', async (e) => {
    state.location = e.detail;
    navbar.update({ locationName: `${state.location.name}, ${state.location.region}` });
    
    try {
      state.weather = await getWeather(state.location.name);
      
      if (weatherCard.update) weatherCard.update({ ...state.weather, locationName: `${state.location.name}, ${state.location.region}` });
      if (weatherForecast.update) weatherForecast.update({ forecast: state.weather.forecast });
      
      weatherRow.classList.remove('hidden');
      
      if (state.analysis) {
        diseaseRisk.update({ weather: state.weather, disease: state.analysis.disease });
        diseaseRisk.show();
        
        state.healthScore = calculateHealthScore(state.analysis, state.weather);
        healthScore.update(state.healthScore);
        
        actionTimeline.update({ forecast: state.weather.forecast, disease: state.analysis.disease });
        
        updateSummaryCards();
      }
      
      toast.success(`Weather data loaded for ${state.location.name}`);
    } catch (err) {
      toast.error("Failed to load weather data.");
    }
  });

  document.addEventListener('agriai:analyze-requested', async () => {
    if (!state.image) {
      toast.error("Please upload an image first.");
      return;
    }
    if (!state.location) {
      toast.warning("Please select a location first for accurate advisory.");
      return;
    }
    
    state.isAnalyzing = true;
    if (imageUploader.update) imageUploader.update({ analyzing: true });
    
    cropAnalysis.show();
    cropAnalysis.update({ analyzing: true });
    
    // Smooth scroll
    cropAnalysisContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    try {
      state.analysis = await analyzeCrop(state.image.file);
      
      if (imageUploader.update) imageUploader.update({ analyzed: true, analyzing: false });
      cropAnalysis.update({ result: state.analysis, imageUrl: state.image.previewUrl });
      
      diseaseInfo.update({ analysis: state.analysis, weather: state.weather });
      diseaseInfo.show();
      
      if (state.weather) {
        diseaseRisk.update({ weather: state.weather, disease: state.analysis.disease });
        diseaseRisk.show();
        
        state.healthScore = calculateHealthScore(state.analysis, state.weather);
        healthScore.update(state.healthScore);
        
        actionTimeline.update({ forecast: state.weather.forecast, disease: state.analysis.disease });
      }
      
      recommendations.update({ recommendations: state.analysis.recommendations });
      recommendations.show();
      
      diseaseRow.classList.remove('hidden');
      finalRow.classList.remove('hidden');
      
      updateSummaryCards();
      summaryCardsContainer.classList.remove('hidden');
      
      toast.success("Analysis complete! Scroll down for results");
    } catch (err) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      state.isAnalyzing = false;
    }
  });
});
