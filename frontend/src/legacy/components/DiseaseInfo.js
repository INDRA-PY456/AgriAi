export function createDiseaseInfo(container) {
  const section = document.createElement('div');
  section.className = 'disease-info hidden';
  
  section.innerHTML = `
    <div class="card">
      <div class="disease-info__header" id="disease-toggle">
        <div>
          <h2 class="section-title"><i data-lucide="bug" style="width:20px;height:20px;"></i> Disease Analysis</h2>
          <p class="section-subtitle" id="disease-subtitle"></p>
        </div>
        <span class="disease-info__arrow">▼</span>
      </div>
      <div class="disease-info__content" id="disease-content">
        <div class="disease-info__section">
          <h3>What is happening?</h3>
          <p class="disease-info__description" id="disease-desc"></p>
        </div>
        <div class="disease-info__progression">
          <h3>Chance of getting worse</h3>
          <div>
            <span class="disease-info__progression-value" id="disease-progression-val"></span>
          </div>
          <div class="disease-info__progression-bar">
            <div class="disease-info__progression-fill" id="disease-progression-fill"></div>
          </div>
          <p id="disease-explanation"></p>
        </div>
      </div>
    </div>
  `;
  container.appendChild(section);
  
  if (window.lucide) lucide.createIcons();
  
  const header = section.querySelector('#disease-toggle');
  const content = section.querySelector('#disease-content');
  const arrow = section.querySelector('.disease-info__arrow');
  let isExpanded = true;
  
  header.addEventListener('click', () => {
    isExpanded = !isExpanded;
    content.style.display = isExpanded ? 'block' : 'none';
    arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
  });
  
  function update(data) {
    const { analysis, weather } = data;
    if (!analysis) return;
    
    section.querySelector('#disease-subtitle').textContent = analysis.disease;
    section.querySelector('#disease-desc').textContent = analysis.description || `The crop is showing symptoms of ${analysis.disease}.`;
    
    let progressionRisk = 50; 
    let explanation = `Currently monitoring ${analysis.disease} progression.`;
    
    if (weather && weather.current) {
       const humidity = weather.current.humidity || 70;
       const temp = weather.current.temperature || 25;
       const rainProb = weather.forecast && weather.forecast[1] ? (weather.forecast[1].rainProbability || 0) : 0;
       
       if (humidity > 80) progressionRisk += 20;
       if (temp > 20 && temp < 30) progressionRisk += 10;
       if (rainProb > 50) progressionRisk += 15;
       
       progressionRisk = Math.min(100, Math.max(0, progressionRisk));
       
       explanation = `With humidity at ${humidity}% and temperatures around ${temp}°C, conditions are favorable for ${analysis.disease}. ${rainProb > 50 ? "Tomorrow's high rain probability may accelerate disease progression." : "Low upcoming rainfall may slow progression slightly."}`;
    }
    
    let level = 'Medium';
    let color = 'var(--color-warning)';
    if (progressionRisk > 70) {
      level = 'High';
      color = 'var(--color-danger)';
    } else if (progressionRisk < 40) {
      level = 'Low';
      color = 'var(--color-success)';
    }
    
    section.querySelector('#disease-progression-val').textContent = `${level} — ${progressionRisk}%`;
    section.querySelector('#disease-progression-val').style.color = color;
    
    const fill = section.querySelector('#disease-progression-fill');
    fill.style.width = '0%';
    fill.style.backgroundColor = color;
    setTimeout(() => {
      fill.style.width = `${progressionRisk}%`;
    }, 100);
    
    section.querySelector('#disease-explanation').textContent = explanation;
  }
  
  function show() { section.classList.remove('hidden'); }
  function hide() { section.classList.add('hidden'); }
  
  return { element: section, update, show, hide };
}
