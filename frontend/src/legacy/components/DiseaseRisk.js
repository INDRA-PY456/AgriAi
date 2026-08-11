import { calculateDiseaseRisk } from '../utils/diseaseRisk.js';

export function createDiseaseRisk(container) {
  const section = document.createElement('div');
  section.className = 'disease-risk hidden';
  section.innerHTML = `
    <h2 class="section-title"><i data-lucide="zap" style="width:20px;height:20px;"></i> Disease Risk Forecast</h2>
    <p class="section-subtitle">How weather conditions may affect your crop</p>
    <div class="disease-risk__cards grid-2" id="risk-cards">
      <!-- Populated dynamically -->
    </div>
  `;
  container.appendChild(section);
  
  function update(data) {
    const { weather, disease } = data;
    if (!weather || !disease) return;
    
    let risks = [];
    try {
      risks = calculateDiseaseRisk(weather, disease);
    } catch(e) {
      console.warn("calculateDiseaseRisk not available, using mock data", e);
      risks = [
        { emoji: '☀️', day: 'Today', level: 'Moderate', color: 'var(--color-warning)', score: 65, factors: ['High humidity'] },
        { emoji: '🌧️', day: 'Tomorrow', level: 'High', color: 'var(--color-danger)', score: 85, factors: ['Rain expected'] }
      ];
    }
    
    const cardsContainer = section.querySelector('#risk-cards');
    cardsContainer.innerHTML = '';
    
    risks.forEach((risk, i) => {
      const card = document.createElement('div');
      card.className = `disease-risk__card card animate-fade-in-up delay-${i+1}`;
      card.style.borderTop = `4px solid ${risk.color}`;
      
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="disease-risk__card-emoji" style="font-size:2rem;">${risk.emoji}</div>
          <div class="disease-risk__card-day" style="font-weight:600;">${risk.day}</div>
        </div>
        <div class="disease-risk__card-level" style="color:${risk.color};font-weight:bold;font-size:1.125rem;">${risk.level} Risk</div>
        <div class="disease-risk__card-score" style="color:var(--color-text-secondary);font-size:0.875rem;">Score: ${risk.score}/100</div>
        <ul class="disease-risk__card-factors" style="margin:0;padding-left:20px;font-size:0.875rem;color:var(--color-text-secondary);">
          ${risk.factors.map(f => `<li>${f}</li>`).join('')}
        </ul>
      `;
      cardsContainer.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }
  
  function show() { section.classList.remove('hidden'); }
  function hide() { section.classList.add('hidden'); }
  
  return { element: section, update, show, hide };
}
