export function createNavbar(container) {
  const section = document.createElement('div');
  section.className = 'navbar-wrapper';
  section.innerHTML = `
    <nav class="navbar">
      <div class="navbar__inner container">
        <div class="navbar__brand">
          <div class="navbar__logo">
            <i data-lucide="leaf" style="width:20px;height:20px;color:white;"></i>
          </div>
          <span class="navbar__title">AgriAI</span>
        </div>
        <div class="navbar__center">
          <span class="navbar__tagline">AI-powered crop health & weather advisory</span>
        </div>
        <div class="navbar__actions">
          <div class="navbar__location" id="nav-location">
            <i data-lucide="map-pin" style="width:14px;height:14px;"></i>
            <span class="navbar__location-text">No location set</span>
          </div>
          <button class="navbar__profile-btn" aria-label="Profile">
            <i data-lucide="user" style="width:18px;height:18px;"></i>
          </button>
          <button class="navbar__menu-btn" aria-label="Menu" id="nav-menu-btn">
            <i data-lucide="menu" style="width:20px;height:20px;"></i>
          </button>
        </div>
      </div>
    </nav>
  `;
  container.appendChild(section);
  if (window.lucide) lucide.createIcons();

  const locationText = section.querySelector('.navbar__location-text');

  function update(data) {
    if (data && data.locationName) {
      locationText.textContent = data.locationName;
    }
  }

  function show() { section.classList.remove('hidden'); }
  function hide() { section.classList.add('hidden'); }

  return { element: section, update, show, hide };
}
