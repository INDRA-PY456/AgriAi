export function createCropAnalysis(container) {
  const section = document.createElement('div');
  section.className = 'crop-analysis hidden';
  container.appendChild(section);
  
  function update(data) {
    if (data.analyzing) {
      section.innerHTML = `
        <div class="card">
          <div class="crop-analysis__loading">
            <div class="loading-spinner" style="width:48px;height:48px;border-width:4px;"></div>
            <p style="font-weight:600;font-size:1.1rem;margin-top:8px;"><i data-lucide="scan-line" style="width:20px;height:20px;display:inline;vertical-align:middle;"></i> AI is analyzing your crop...</p>
            <p style="color:var(--color-text-secondary);font-size:0.9rem;">This usually takes a few seconds</p>
          </div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    } else if (data.result && data.imageUrl) {
      const { result, imageUrl } = data;
      const severityMap = { 'Low': 'success', 'Moderate': 'warning', 'High': 'danger', 'Severe': 'danger' };
      const severityBadge = severityMap[result.severity] || 'warning';
      
      section.innerHTML = `
        <div class="card">
          <h2 class="section-title"><i data-lucide="scan-line" style="width:20px;height:20px;"></i> AI Crop Analysis</h2>
          <div class="crop-analysis__result animate-fade-in-up">
            <div class="crop-analysis__image">
              <img src="${imageUrl}" alt="Analyzed crop image">
            </div>
            <div class="crop-analysis__info">
              <div class="crop-analysis__crop-name">Detected Crop</div>
              <h3 style="font-size:1.1rem;margin:2px 0;">${result.crop}</h3>
              <div class="crop-analysis__disease">${result.disease}</div>
              <div class="crop-analysis__confidence" style="margin-top:12px;">
                <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
                  <span style="color:var(--color-text-secondary);font-size:0.85rem;">AI Confidence</span>
                  <span class="crop-analysis__confidence-value">${result.confidence}%</span>
                </div>
                <div class="crop-analysis__confidence-bar">
                  <div class="crop-analysis__confidence-fill" style="width:0%;"></div>
                </div>
              </div>
              <div style="margin-top:12px;display:flex;align-items:center;gap:8px;">
                <span style="color:var(--color-text-secondary);font-size:0.85rem;">Severity</span>
                <span class="badge badge--${severityBadge}">${result.severity}</span>
              </div>
            </div>
          </div>
        </div>
      `;
      
      if (window.lucide) lucide.createIcons();
      
      // Animate confidence bar
      setTimeout(() => {
        const fill = section.querySelector('.crop-analysis__confidence-fill');
        if (fill) fill.style.width = `${result.confidence}%`;
      }, 100);
    }
  }
  
  function show() { section.classList.remove('hidden'); }
  function hide() { section.classList.add('hidden'); }
  
  return { element: section, update, show, hide };
}
