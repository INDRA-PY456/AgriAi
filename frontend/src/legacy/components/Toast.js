export function createToastSystem(container) {
  const section = document.createElement('div');
  section.className = 'toast-system-wrapper';
  container.appendChild(section);
  
  function show(message, type = 'info', duration = 4000) {
    const icons = {
      success: '<i data-lucide="check-circle" style="width:18px;height:18px;color:var(--color-primary)"></i>',
      warning: '<i data-lucide="alert-triangle" style="width:18px;height:18px;color:var(--color-accent)"></i>',
      error: '<i data-lucide="x-circle" style="width:18px;height:18px;color:var(--color-danger)"></i>',
      info: '<i data-lucide="info" style="width:18px;height:18px;color:var(--color-primary)"></i>'
    };
    const icon = icons[type] || icons.info;
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type} animate-slide-down`;
    toast.innerHTML = `
      <span class="toast__icon">${icon}</span>
      <span class="toast__message">${message}</span>
      <button class="toast__close" aria-label="Close">×</button>
    `;
    
    // Add toast to container directly since container is usually toast-container
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();
    
    const closeBtn = toast.querySelector('.toast__close');
    
    const removeToast = () => {
      toast.classList.add('removing');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    };
    
    closeBtn.addEventListener('click', removeToast);
    
    setTimeout(removeToast, duration);
  }

  document.addEventListener('agriai:toast', (e) => {
    show(e.detail.message, e.detail.type);
  });
  
  function update(data) {}
  function showComponent() { section.classList.remove('hidden'); }
  function hideComponent() { section.classList.add('hidden'); }
  
  return { element: section, update, show: showComponent, hide: hideComponent, showToast: show };
}
