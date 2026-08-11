import { getBestTimeToAct } from '../utils/weatherAdvisor.js';

export function createActionTimeline(container) {
  const section = document.createElement('div');
  section.className = 'action-timeline hidden';
  section.innerHTML = `
    <h2 class="section-title"><i data-lucide="clock" style="width:20px;height:20px;"></i> Best Time to Act</h2>
    <p class="section-subtitle">Weather-aware treatment timing recommendations</p>
    
    <div class="action-timeline__summary">
      <div class="action-timeline__best card">
        <div style="font-size:0.875rem;color:var(--color-text-secondary);margin-bottom:8px;">✅ Best Window</div>
        <div class="action-timeline__best-status" id="best-status"></div>
        <p class="action-timeline__best-reason" id="best-reason"></p>
      </div>
      <div class="action-timeline__avoid card" style="border-left:4px solid var(--color-danger);">
        <div style="font-size:0.875rem;color:var(--color-text-secondary);margin-bottom:8px;">🚫 Avoid</div>
        <div class="action-timeline__avoid-status" id="avoid-status"></div>
        <p class="action-timeline__avoid-reason" id="avoid-reason"></p>
      </div>
    </div>
    
    <div class="action-timeline__timeline card">
      <h3 style="font-weight:600;margin-bottom:16px;">Treatment Timeline</h3>
      <div id="timeline-entries" class="action-timeline__entries">
      </div>
    </div>
  `;
  container.appendChild(section);
  
  function update(data) {
    const { forecast, disease } = data;
    if (!forecast || !disease) return;
    
    let advice;
    try {
      advice = getBestTimeToAct(forecast, disease);
    } catch(e) {
      console.warn("getBestTimeToAct not available", e);
      advice = {
        bestWindow: { time: 'Tomorrow Morning', status: 'Optimal', reason: 'Low wind, no rain.' },
        avoidWindow: { time: 'Today Afternoon', reason: 'High temperature and potential rain.' },
        timeline: [
          { time: 'Today 14:00', status: 'Too Hot', icon: '☀️', color: 'var(--color-danger)' },
          { time: 'Tomorrow 06:00', status: 'Optimal', icon: '✅', color: 'var(--color-success)' }
        ]
      };
    }
    
    section.querySelector('#best-status').textContent = `${advice.bestWindow.time}: ${advice.bestWindow.status}`;
    section.querySelector('#best-reason').textContent = advice.bestWindow.reason;
    section.querySelector('#avoid-status').textContent = advice.avoidWindow.time;
    section.querySelector('#avoid-reason').textContent = advice.avoidWindow.reason;
    
    const timelineContainer = section.querySelector('#timeline-entries');
    timelineContainer.innerHTML = '';
    
    (advice.timeline || []).forEach(step => {
      const entry = document.createElement('div');
      entry.className = 'action-timeline__step';
      
      entry.innerHTML = `
        <div class="action-timeline__step-dot" style="background-color:${step.color};"></div>
        <div class="action-timeline__step-content">
          <div class="action-timeline__step-time">${step.time}</div>
          <span class="action-timeline__step-status badge" style="background-color:${step.color}20;color:${step.color};border:1px solid ${step.color}40;">${step.icon} ${step.status}</span>
        </div>
      `;
      timelineContainer.appendChild(entry);
    });

    if (window.lucide) lucide.createIcons();
  }
  
  function show() { section.classList.remove('hidden'); }
  function hide() { section.classList.add('hidden'); }
  
  return { element: section, update, show, hide };
}
