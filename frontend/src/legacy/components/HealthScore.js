export function createHealthScore(container) {
  const section = document.createElement('div');
  section.className = 'health-score hidden';
  section.innerHTML = `
    <div class="card">
      <h2 class="section-title"><i data-lucide="heart-pulse" style="width:20px;height:20px;"></i> Overall Crop Health</h2>
      <div class="health-score__ring-container">
        <svg class="health-score__ring" viewBox="0 0 200 200" width="180" height="180">
          <circle class="health-score__ring-bg" cx="100" cy="100" r="85" 
                  stroke-width="12" fill="none" stroke="var(--color-border-light)"/>
          <circle class="health-score__ring-fill" cx="100" cy="100" r="85" 
                  stroke-width="12" fill="none" stroke="var(--color-primary)" 
                  stroke-linecap="round"
                  stroke-dasharray="534" 
                  stroke-dashoffset="534"
                  transform="rotate(-90 100 100)" />
        </svg>
        <div>
          <div class="health-score__value">0</div>
          <div class="health-score__max">/100</div>
        </div>
      </div>
      <div class="health-score__label" id="health-label">--</div>
      
      <div class="health-score__breakdown">
        <div class="health-score__breakdown-item">
          <span class="health-score__breakdown-label">🦠 Disease Severity</span>
          <div class="health-score__breakdown-bar">
            <div class="health-score__breakdown-fill" id="breakdown-disease" style="width:0%;background:var(--color-danger);"></div>
          </div>
          <span class="health-score__breakdown-value" id="val-disease">0%</span>
        </div>
        <div class="health-score__breakdown-item">
          <span class="health-score__breakdown-label">🌧️ Weather Risk</span>
          <div class="health-score__breakdown-bar">
            <div class="health-score__breakdown-fill" id="breakdown-weather" style="width:0%;background:var(--color-warning);"></div>
          </div>
          <span class="health-score__breakdown-value" id="val-weather">0%</span>
        </div>
        <div class="health-score__breakdown-item">
          <span class="health-score__breakdown-label">📈 Spread Probability</span>
          <div class="health-score__breakdown-bar">
            <div class="health-score__breakdown-fill" id="breakdown-spread" style="width:0%;background:var(--color-accent);"></div>
          </div>
          <span class="health-score__breakdown-value" id="val-spread">0%</span>
        </div>
      </div>
    </div>
  `;
  container.appendChild(section);
  
  if (window.lucide) lucide.createIcons();
  
  function update(data) {
    if (!data || !data.breakdown) return;
    const { overall, breakdown: { diseaseSeverity, weatherRisk, spreadProbability } } = data;
    
    const circumference = 534;
    const offset = circumference * (1 - overall/100);
    const ringFill = section.querySelector('.health-score__ring-fill');
    const valueEl = section.querySelector('.health-score__value');
    const labelEl = section.querySelector('#health-label');
    
    let color, labelText;
    if (overall <= 40) {
      color = 'var(--color-danger)';
      labelText = 'Poor Crop Health';
    } else if (overall <= 60) {
      color = 'var(--color-warning)';
      labelText = 'Below Average';
    } else if (overall <= 75) {
      color = 'var(--color-accent)';
      labelText = 'Moderate Crop Health';
    } else {
      color = 'var(--color-success)';
      labelText = 'Good Crop Health';
    }
    
    valueEl.textContent = overall;
    labelEl.textContent = labelText;
    labelEl.style.color = color;
    
    setTimeout(() => {
      ringFill.style.strokeDashoffset = offset;
      ringFill.style.stroke = color;
      
      section.querySelector('#breakdown-disease').style.width = `${diseaseSeverity}%`;
      section.querySelector('#val-disease').textContent = `${diseaseSeverity}%`;
      
      section.querySelector('#breakdown-weather').style.width = `${weatherRisk}%`;
      section.querySelector('#val-weather').textContent = `${weatherRisk}%`;
      
      section.querySelector('#breakdown-spread').style.width = `${spreadProbability}%`;
      section.querySelector('#val-spread').textContent = `${spreadProbability}%`;
    }, 100);
  }
  
  function show() { section.classList.remove('hidden'); }
  function hide() { section.classList.add('hidden'); }
  
  return { element: section, update, show, hide };
}
