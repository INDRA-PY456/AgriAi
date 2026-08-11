export function createRecommendations(container) {
  const section = document.createElement('div');
  section.className = 'recommendations hidden';
  section.innerHTML = `
    <h2 class="section-title"><i data-lucide="check-circle-2" style="width:20px;height:20px;"></i> What Should You Do?</h2>
    <p class="section-subtitle">Recommended actions based on AI analysis and weather conditions</p>
    <div class="recommendations__list" id="recommendations-list">
      <!-- Populated dynamically -->
    </div>
  `;
  container.appendChild(section);
  
  function update(data) {
    const { recommendations } = data;
    if (!recommendations || !recommendations.length) return;
    
    const listContainer = section.querySelector('#recommendations-list');
    listContainer.innerHTML = '';
    
    recommendations.forEach((rec, i) => {
      const isHigh = rec.priority === 'high';
      const item = document.createElement('div');
      item.className = `recommendations__item card animate-fade-in-up delay-${i+1} ${isHigh ? 'recommendations__item--high' : ''}`;
      item.style.borderLeft = isHigh ? '4px solid var(--color-danger)' : '4px solid var(--color-primary)';
      
      item.innerHTML = `
        <div class="recommendations__item-number">${i+1}</div>
        <div class="recommendations__item-icon">${rec.icon || '📌'}</div>
        <div class="recommendations__item-content">
          <h3 class="recommendations__item-title">${rec.title}</h3>
          <p class="recommendations__item-desc">${rec.description}</p>
          ${rec.disclaimer ? `<p class="recommendations__item-disclaimer">⚠️ ${rec.disclaimer}</p>` : ''}
        </div>
      `;

      listContainer.appendChild(item);
    });

    if (window.lucide) lucide.createIcons();
  }
  
  function show() { section.classList.remove('hidden'); }
  function hide() { section.classList.add('hidden'); }
  
  return { element: section, update, show, hide };
}
