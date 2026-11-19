/**
 * AARK Innovations Hero — Streamline Engine & Interactive Tech Pipeline
 * 
 * Features:
 *  1. Full Light Theme by default & Dark Theme toggle support
 *  2. 100% Offline Support for file:/// via pre-baked vector coordinates (assets/aarkin_points.js)
 *  3. Tall Aarkin "A" Logo (~520px height, ~70% viewport)
 *  4. Reference-Accurate Triangular Architectural Light Funnel / Cone with sharp vertex tip
 *  5. Particle ease-in acceleration (slow start -> fast snap -> returning loop)
 *  6. 3D Isometric SVG Tech Badges that travel from vertex tip along the beam to the VERY END of the line (window edge)
 *  7. ZERO OVERLAP GUARANTEE: Enforced 240px spacing + cooldown timer + identical uniform velocity across all badges
 */

(function () {
  'use strict';

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) {
    console.error('Canvas element not found.');
    return;
  }
  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Logo Center & Dimensions
  let cx = width * 0.22;
  let cy = height * 0.52;
  let logoHeight = Math.min(height * 0.70, 520);
  let logoWidth = logoHeight * 1.08;

  // Focal Vertex Pinch Point
  let fx = width * 0.49;
  let fy = height * 0.54;

  // Streamline Rays & Particles
  const NUM_RAYS = 135;
  let rays = [];
  let particles = [];
  let ambientComets = [];

  // Focal Tip Burst Pulse
  let focalBurst = 0;

  // Mouse / Pointer State
  const mouse = {
    x: -1000,
    y: -1000,
    radius: 90,
    isHovering: false,
    hasPendingTrigger: false
  };

  // --------------------------------------------------------------------------
  // Theme Detection & Management (Light Theme Default with Persistence)
  // --------------------------------------------------------------------------
  function isDarkTheme() {
    return document.body.classList.contains('dark-theme');
  }

  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');

  function updateThemeUI() {
    const isDark = isDarkTheme();
    if (themeIcon) themeIcon.textContent = isDark ? '🌙' : '☀️';
    if (themeText) themeText.textContent = isDark ? 'Dark Mode' : 'Light Mode';
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    }
    updateParticleColors();
  }

  // Restore saved theme preference if present
  try {
    const savedTheme = localStorage.getItem('aarkinn-theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else if (savedTheme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  } catch (e) {}

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      document.body.classList.toggle('light-theme');
      const isDark = isDarkTheme();
      try {
        localStorage.setItem('aarkinn-theme', isDark ? 'dark' : 'light');
      } catch (e) {}
      updateThemeUI();
    });
  }

  // Mobile navigation menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Initial call to align UI and particle colors
  updateThemeUI();

  // --------------------------------------------------------------------------
  // 1. Rich 3D Isometric SVG Icons & Tech Nodes
  // --------------------------------------------------------------------------
  const SVG_3D_ICONS = {
    // 3D Isometric Cloud with Volumetric Layering & Blue Glow
    cloud: `
      <svg class="icon-3d" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cloudGrad" x1="6" y1="10" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stop-color="#38BDF8"/>
            <stop offset="0.45" stop-color="#2563EB"/>
            <stop offset="1" stop-color="#0F172A"/>
          </linearGradient>
          <radialGradient id="cloudGlow" cx="18" cy="14" r="16" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFFFFF" stop-opacity="0.9"/>
            <stop offset="0.5" stop-color="#7DD3FC" stop-opacity="0.4"/>
            <stop offset="1" stop-color="#2563EB" stop-opacity="0"/>
          </radialGradient>
          <filter id="cloudShadow" x="0" y="4" width="48" height="44" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0284C7" flood-opacity="0.5"/>
          </filter>
        </defs>
        <g filter="url(#cloudShadow)">
          <path d="M35 34H15C10.58 34 7 30.42 7 26C7 21.83 10.18 18.41 14.31 18.04C15.53 12.06 20.77 7.5 27 7.5C34.51 7.5 40.6 13.59 40.6 21.1C40.6 21.64 40.57 22.18 40.5 22.71C42.01 23.93 43 25.8 43 27.9C43 31.27 40.31 34 37 34H35Z" fill="url(#cloudGrad)" stroke="rgba(255,255,255,0.45)" stroke-width="1.1"/>
          <path d="M35 34H15C10.58 34 7 30.42 7 26C7 21.83 10.18 18.41 14.31 18.04C15.53 12.06 20.77 7.5 27 7.5C34.51 7.5 40.6 13.59 40.6 21.1C40.6 21.64 40.57 22.18 40.5 22.71C42.01 23.93 43 25.8 43 27.9C43 31.27 40.31 34 37 34H35Z" fill="url(#cloudGlow)" mix-blend-mode="overlay"/>
          <ellipse cx="25" cy="16" rx="10" ry="4.5" fill="rgba(255,255,255,0.4)" filter="blur(1.5px)"/>
        </g>
      </svg>
    `,

    // 3D Isometric Enterprise Cube Mainframe (Oracle ERP)
    erp: `
      <svg class="icon-3d" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="erpTop" x1="12" y1="6" x2="36" y2="20" gradientUnits="userSpaceOnUse">
            <stop stop-color="#93C5FD"/>
            <stop offset="1" stop-color="#3B82F6"/>
          </linearGradient>
          <linearGradient id="erpLeft" x1="10" y1="18" x2="24" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1D4ED8"/>
            <stop offset="1" stop-color="#0F172A"/>
          </linearGradient>
          <linearGradient id="erpRight" x1="24" y1="18" x2="38" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2563EB"/>
            <stop offset="1" stop-color="#1E293B"/>
          </linearGradient>
          <filter id="erpShadow" x="2" y="4" width="44" height="42" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#2563EB" flood-opacity="0.45"/>
          </filter>
        </defs>
        <g filter="url(#erpShadow)">
          <!-- Top Face -->
          <path d="M24 7L38 15L24 23L10 15L24 7Z" fill="url(#erpTop)" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/>
          <!-- Left Face -->
          <path d="M10 15L24 23V39L10 31V15Z" fill="url(#erpLeft)" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
          <!-- Right Face -->
          <path d="M24 23L38 15V31L24 39V23Z" fill="url(#erpRight)" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
          <!-- Server Status Glow Lines -->
          <line x1="27" y1="26" x2="35" y2="21.5" stroke="#38BDF8" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="27" y1="30" x2="35" y2="25.5" stroke="#38BDF8" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="20" cy="27" r="1.3" fill="#38BDF8"/>
          <circle cx="16" cy="29" r="1.3" fill="#10B981"/>
        </g>
      </svg>
    `,

    // 3D Isometric Data Lakehouse Cylinders with Glowing Energy Rings
    data: `
      <svg class="icon-3d" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cylGrad" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0284C7"/>
            <stop offset="0.6" stop-color="#0369A1"/>
            <stop offset="1" stop-color="#0C4A6E"/>
          </linearGradient>
          <linearGradient id="cylCap" x1="14" y1="8" x2="34" y2="18" gradientUnits="userSpaceOnUse">
            <stop stop-color="#7DD3FC"/>
            <stop offset="1" stop-color="#0284C7"/>
          </linearGradient>
          <filter id="dataShadow" x="4" y="4" width="40" height="42" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0284C7" flood-opacity="0.5"/>
          </filter>
        </defs>
        <g filter="url(#dataShadow)">
          <!-- Base Cylinder -->
          <path d="M12 28C12 25 17.37 23 24 23C30.63 23 36 25 36 28V34C36 37 30.63 39 24 39C17.37 39 12 37 12 34V28Z" fill="url(#cylGrad)" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
          <ellipse cx="24" cy="28" rx="12" ry="5" fill="url(#cylCap)" stroke="rgba(255,255,255,0.5)" stroke-width="0.8"/>
          <!-- Middle Ring Glow -->
          <path d="M12 20C12 17 17.37 15 24 15C30.63 15 36 17 36 20V24C36 27 30.63 29 24 29C17.37 29 12 27 12 24V20Z" fill="url(#cylGrad)" stroke="rgba(56,189,248,0.5)" stroke-width="0.8"/>
          <ellipse cx="24" cy="20" rx="12" ry="5" fill="url(#cylCap)" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/>
          <!-- Top Disc -->
          <path d="M12 12C12 9 17.37 7 24 7C30.63 7 36 9 36 12V15C36 18 30.63 20 24 20C17.37 20 12 18 12 15V12Z" fill="url(#cylGrad)" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
          <ellipse cx="24" cy="12" rx="12" ry="5" fill="#BAE6FD" stroke="#FFFFFF" stroke-width="0.9"/>
          <!-- Glowing Center Core Accent -->
          <ellipse cx="24" cy="12" rx="6" ry="2.5" fill="#38BDF8"/>
        </g>
      </svg>
    `,

    // 3D Isometric AI Neural Silicon Chip with Glowing Core
    ai: `
      <svg class="icon-3d" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aiDie" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1E293B"/>
            <stop offset="0.5" stop-color="#0F172A"/>
            <stop offset="1" stop-color="#020617"/>
          </linearGradient>
          <linearGradient id="aiCore" x1="18" y1="18" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stop-color="#38BDF8"/>
            <stop offset="0.5" stop-color="#818CF8"/>
            <stop offset="1" stop-color="#C084FC"/>
          </linearGradient>
          <filter id="aiGlow" x="2" y="2" width="44" height="44" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#818CF8" flood-opacity="0.6"/>
          </filter>
        </defs>
        <g filter="url(#aiGlow)">
          <!-- Substrate Board -->
          <rect x="8" y="8" width="32" height="32" rx="7" fill="url(#aiDie)" stroke="rgba(129,140,248,0.5)" stroke-width="1.2"/>
          <!-- Metallic Circuit Pins -->
          <line x1="16" y1="4" x2="16" y2="8" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="24" y1="4" x2="24" y2="8" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="32" y1="4" x2="32" y2="8" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="16" y1="40" x2="16" y2="44" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="24" y1="40" x2="24" y2="44" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="32" y1="40" x2="32" y2="44" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="4" y1="16" x2="8" y2="16" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="4" y1="24" x2="8" y2="24" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="4" y1="32" x2="8" y2="32" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="40" y1="16" x2="44" y2="16" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="40" y1="24" x2="44" y2="24" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="40" y1="32" x2="44" y2="32" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
          <!-- Glowing Neural Core Die -->
          <rect x="16" y="16" width="16" height="16" rx="4" fill="url(#aiCore)" stroke="#FFFFFF" stroke-width="1"/>
          <!-- 3D Center Energy Node -->
          <circle cx="24" cy="24" r="3.5" fill="#FFFFFF"/>
        </g>
      </svg>
    `,

    // 3D Isometric Enterprise CRM Network Sphere with Orbit Ring
    crm: `
      <svg class="icon-3d" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="crmSphere" cx="20" cy="18" r="16" gradientUnits="userSpaceOnUse">
            <stop stop-color="#60A5FA"/>
            <stop offset="0.5" stop-color="#2563EB"/>
            <stop offset="1" stop-color="#0F172A"/>
          </radialGradient>
          <filter id="crmShadow" x="2" y="4" width="44" height="42" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#2563EB" flood-opacity="0.5"/>
          </filter>
        </defs>
        <g filter="url(#crmShadow)">
          <!-- Orbit Ring Behind -->
          <ellipse cx="24" cy="25" rx="19" ry="8" stroke="rgba(56,189,248,0.4)" stroke-width="1.2" stroke-dasharray="3 2"/>
          <!-- 3D Central Globe Sphere -->
          <circle cx="24" cy="24" r="12" fill="url(#crmSphere)" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
          <!-- User Profile Silhouette on 3D Orb -->
          <circle cx="24" cy="20" r="3.5" fill="#FFFFFF"/>
          <path d="M17.5 28C17.5 25.5 20.4 24.5 24 24.5C27.6 24.5 30.5 25.5 30.5 28V29C30.5 29.5 30 30 29.5 30H18.5C18 30 17.5 29.5 17.5 29V28Z" fill="#FFFFFF"/>
          <!-- Orbit Satellite Node -->
          <circle cx="39" cy="22" r="3" fill="#38BDF8" stroke="#FFFFFF" stroke-width="0.8"/>
          <!-- Orbit Ring Foreground Pass -->
          <path d="M5 25C5 28 13.5 32 24 32C34.5 32 43 28 43 25" stroke="rgba(56,189,248,0.85)" stroke-width="1.5"/>
        </g>
      </svg>
    `,

    // 3D Isometric Interconnected Hexagonal API Pipeline Modules
    api: `
      <svg class="icon-3d" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="apiHex1" x1="10" y1="10" x2="26" y2="34" gradientUnits="userSpaceOnUse">
            <stop stop-color="#38BDF8"/>
            <stop offset="1" stop-color="#0284C7"/>
          </linearGradient>
          <linearGradient id="apiHex2" x1="22" y1="14" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stop-color="#818CF8"/>
            <stop offset="1" stop-color="#4F46E5"/>
          </linearGradient>
          <filter id="apiShadow" x="2" y="4" width="44" height="42" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0284C7" flood-opacity="0.5"/>
          </filter>
        </defs>
        <g filter="url(#apiShadow)">
          <!-- Left Hexagon -->
          <path d="M18 10L27 15V25L18 30L9 25V15L18 10Z" fill="url(#apiHex1)" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
          <!-- Right Hexagon -->
          <path d="M30 18L39 23V33L30 38L21 33V23L30 18Z" fill="url(#apiHex2)" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
          <!-- 3D High-Speed Connector Bridge -->
          <path d="M21 21L27 25" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="18" cy="20" r="2.5" fill="#FFFFFF"/>
          <circle cx="30" cy="28" r="2.5" fill="#FFFFFF"/>
        </g>
      </svg>
    `
  };

  const techNodes = [
    { type: 'cloud', title: 'Cloud Architecture', sub: 'AWS · Azure · GCP' },
    { type: 'erp',   title: 'Oracle ERP',         sub: 'Fusion Cloud & EBS' },
    { type: 'data',  title: 'Data Lakehouse',     sub: 'Snowflake · Databricks' },
    { type: 'ai',    title: 'Applied AI',         sub: 'RAG & Private Workflows' },
    { type: 'crm',   title: 'Enterprise CRM',     sub: 'Salesforce & RevOps' },
    { type: 'api',   title: 'API Integrations',   sub: 'OIC · Kafka · dbt' }
  ];

  let nextIconIndex = 0;
  let activeIcons = [];
  const tickerTrack = document.getElementById('ticker-track');

  // Spacing & Overlap Prevention Constraints
  const MIN_BADGE_SPACING = 240; // Minimum px distance between consecutive badges
  const MIN_SPAWN_INTERVAL = 2400; // Minimum ms cooldown between spawns
  const BEAM_SPEED = 56; // Exact constant linear speed across all badges (px/sec)
  let lastSpawnTime = 0;

  /**
   * Checks whether the track is ready to spawn a new badge without any risk of overlap.
   */
  function canSpawnNextIcon() {
    const now = performance.now();
    // 1. Time cooldown check: at least MIN_SPAWN_INTERVAL since last spawn
    if (now - lastSpawnTime < MIN_SPAWN_INTERVAL) {
      return false;
    }
    // 2. Spatial distance check: newest badge must have moved at least MIN_BADGE_SPACING from fx
    if (activeIcons.length > 0) {
      const latestBadge = activeIcons[activeIcons.length - 1];
      if ((latestBadge.x - fx) < MIN_BADGE_SPACING) {
        return false;
      }
    }
    // 3. Maximum concurrent badges on screen
    if (activeIcons.length >= 5) {
      return false;
    }
    return true;
  }

  /**
   * Spawns the next 3D isometric tech badge at the focal vertex tip.
   * It travels along the beam line all the way to the right screen edge.
   */
  function spawnNextIcon() {
    if (!tickerTrack) return;
    if (!canSpawnNextIcon()) return;

    lastSpawnTime = performance.now();

    const node = techNodes[nextIconIndex];
    nextIconIndex = (nextIconIndex + 1) % techNodes.length;

    const svgIcon = SVG_3D_ICONS[node.type] || SVG_3D_ICONS.cloud;

    const el = document.createElement('div');
    el.className = 'tech-item';
    el.innerHTML = `
      <div class="tech-badge-3d">
        ${svgIcon}
        <div class="tech-text-group">
          <span class="tech-title">${node.title}</span>
          <span class="tech-sub">${node.sub}</span>
        </div>
      </div>
      <span class="tech-dot"></span>
    `;
    tickerTrack.appendChild(el);

    activeIcons.push({
      element: el,
      x: fx, // Spawns directly at the focal pinch tip (fx)
      speed: BEAM_SPEED, // UNIFORM CONSTANT SPEED across all badges!
      opacity: 0
    });
  }

  /**
   * Animates active tech badges smoothly along the laser beam line
   * all the way to the VERY END of the line (width + 80px),
   * enforcing absolute zero-overlap distance constraints.
   */
  function updateActiveIcons(delta) {
    if (!tickerTrack) return;

    const endBoundary = width + 80;

    // 1. Move all badges forward at uniform speed
    for (let i = 0; i < activeIcons.length; i++) {
      activeIcons[i].x += activeIcons[i].speed * delta;
    }

    // 2. Strict Overlap Prevention: enforce minimum spacing between badges
    // activeIcons[0] is the furthest ahead; trailing badges cannot get closer than MIN_BADGE_SPACING
    for (let i = activeIcons.length - 1; i > 0; i--) {
      const trailing = activeIcons[i];
      const leading = activeIcons[i - 1];
      if (leading.x - trailing.x < MIN_BADGE_SPACING) {
        trailing.x = leading.x - MIN_BADGE_SPACING;
      }
    }

    // 3. Render transforms, opacity, and cleanup off-screen items
    for (let i = activeIcons.length - 1; i >= 0; i--) {
      const item = activeIcons[i];

      const distFromStart = item.x - fx;
      const distFromEnd = endBoundary - item.x;

      // Smooth fade-in as it emerges from vertex tip
      if (distFromStart < 60) {
        item.opacity = Math.max(0, distFromStart / 60);
      } else if (distFromEnd < 80) {
        // Softly fade out only at the very right window edge
        item.opacity = Math.max(0, distFromEnd / 80);
      } else {
        item.opacity = 1.0;
      }

      // Vertical position aligns the tech-dot right onto the horizontal beam (fy)
      item.element.style.transform = `translate3d(${item.x}px, ${fy - 48}px, 0) translateX(-50%)`;
      item.element.style.opacity = item.opacity;

      // When it reaches the very end of the line, remove it
      if (item.x >= endBoundary) {
        item.element.remove();
        activeIcons.splice(i, 1);
      }
    }
  }

  /**
   * Adapts particle colors dynamically between Light Theme and Dark Theme.
   */
  function updateParticleColors() {
    const isDark = isDarkTheme();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (isDark) {
        // Dark theme: ice blues, light cyans, bright whites
        p.color = p.isEdge ? '#7dd3fc' : (p.rawHex || '#60a5fa');
        p.alpha = p.isEdge ? 0.95 : 0.65;
      } else {
        // Light theme: rich royal cobalt, deep sapphire, vibrant sky blue
        p.color = p.isEdge ? '#1e40af' : (p.lightHex || '#2563eb');
        p.alpha = p.isEdge ? 0.95 : 0.82;
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2. Build Streamlines & High-Density Particle System
  // --------------------------------------------------------------------------
  function initSystem() {
    rays = [];
    particles = [];
    ambientComets = [];

    // Align focal vertex point with DOM stream container relative to hero-wrapper (scroll-invariant)
    const heroWrapper = document.querySelector('.hero-wrapper') || document.body;
    const wrapperRect = heroWrapper.getBoundingClientRect();
    const streamContainer = document.getElementById('stream-container');
    if (streamContainer) {
      const rect = streamContainer.getBoundingClientRect();
      fx = rect.left - wrapperRect.left + 4;
      fy = rect.top - wrapperRect.top + rect.height / 2;
    } else {
      fx = width * 0.49;
      fy = height * 0.54;
    }

    if (width <= 1024) {
      cx = width * 0.50;
      cy = height * 0.32;
      logoHeight = Math.min(height * 0.45, 340);
      logoWidth = logoHeight * 1.08;
    } else {
      cx = width * 0.22;
      cy = height * 0.52;
      // Tall, commanding Aarkin "A"
      logoHeight = Math.min(height * 0.70, 520);
      logoWidth = logoHeight * 1.08;
    }

    // Build radiating rays from left edge to (fx, fy)
    const yLeftStart = -height * 0.35;
    const yLeftEnd = height * 1.35;
    const yStep = (yLeftEnd - yLeftStart) / NUM_RAYS;

    for (let i = 0; i < NUM_RAYS; i++) {
      const yLeft = yLeftStart + i * yStep;
      rays.push({
        index: i,
        x0: 0,
        y0: yLeft,
        x1: fx,
        y1: fy
      });

      // Ambient background comets along rays
      if (Math.random() < 0.18) {
        ambientComets.push({
          rayIndex: i,
          yLeft: yLeft,
          t: Math.random(),
          speed: 0.002 + Math.random() * 0.004,
          size: 1.2 + Math.random() * 1.2
        });
      }
    }

    // Initialize particles using pre-baked vector coordinates (100% offline file:/// support)
    const rawPoints = window.AARKIN_LOGO_POINTS || [];
    let pId = 0;
    const isDark = isDarkTheme();

    const lightPalette = ['#1d4ed8', '#2563eb', '#0284c7', '#1e40af', '#3b82f6'];

    for (let i = 0; i < rawPoints.length; i++) {
      const pt = rawPoints[i];
      const u = pt[0];
      const v = pt[1];
      const hexCol = pt[2];
      const isEdge = pt[3];

      const px = cx + u * (logoWidth / 2);
      const py = cy + v * (logoHeight / 2);

      const archSign = Math.random() > 0.5 ? 1 : -1;
      const archHeight = (30 + Math.random() * 55) * archSign;

      const lightCol = lightPalette[pId % lightPalette.length];

      particles.push({
        id: pId++,
        baseX: px,
        baseY: py,
        x: px,
        y: py,
        prevX: px,
        prevY: py,
        state: 'resting', // 'resting' | 'forward' | 'returning'
        progress: 0,
        speed: 0.0075 + Math.random() * 0.007,
        archHeight: archHeight,
        baseSize: isEdge ? 1.7 : 1.35,
        size: isEdge ? 1.7 : 1.35,
        isEdge: isEdge,
        rawHex: hexCol,
        lightHex: lightCol,
        alpha: isEdge ? 0.95 : (isDark ? 0.65 : 0.82),
        color: isDark ? (isEdge ? '#7dd3fc' : hexCol) : (isEdge ? '#1e40af' : lightCol)
      });
    }

    // Spawn initial single badge if track is empty
    if (activeIcons.length === 0) {
      spawnNextIcon();
    }
  }

  // --------------------------------------------------------------------------
  // 3. Pointer Hover Listeners (Triggers Particle Launch & Icon Release)
  // --------------------------------------------------------------------------
  function updatePointer(e) {
    const heroWrapper = document.querySelector('.hero-wrapper');
    if (heroWrapper) {
      const rect = heroWrapper.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      if (mouse.y < 0 || mouse.y > heroWrapper.clientHeight || mouse.x < 0 || mouse.x > heroWrapper.clientWidth) {
        mouse.isHovering = false;
        return;
      }
    } else {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    mouse.isHovering = true;

    const triggerRadiusSq = mouse.radius * mouse.radius;
    let launchedAny = false;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.state === 'resting') {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dSq = dx * dx + dy * dy;

        if (dSq < triggerRadiusSq) {
          p.state = 'forward';
          p.progress = 0;
          p.prevX = p.x;
          p.prevY = p.y;
          launchedAny = true;
        }
      }
    }

    if (launchedAny) {
      mouse.hasPendingTrigger = true;
    }
  }

  window.addEventListener('mousemove', updatePointer);
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updatePointer(e.touches[0]);
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.isHovering = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // --------------------------------------------------------------------------
  // 4. Resize Handling
  // --------------------------------------------------------------------------
  function resize() {
    const heroWrapper = document.querySelector('.hero-wrapper');
    width = heroWrapper ? heroWrapper.clientWidth : window.innerWidth;
    height = heroWrapper ? heroWrapper.clientHeight : window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    initSystem();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
  window.addEventListener('DOMContentLoaded', resize);
  window.addEventListener('pageshow', resize);
  resize();
  setTimeout(resize, 30);
  setTimeout(resize, 100);
  setTimeout(resize, 300);

  // --------------------------------------------------------------------------
  // 5. Main Render Loop
  // --------------------------------------------------------------------------
  let lastTime = performance.now();
  let lastAutoSpawnTime = performance.now();

  function render(now) {
    requestAnimationFrame(render);

    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    const isDark = isDarkTheme();

    ctx.clearRect(0, 0, width, height);

    // ========================================================================
    // A. Reference-Accurate Triangular Light Funnel / Cone (Supports Light & Dark)
    // ========================================================================
    const coneTopY = Math.max(0, fy - height * 0.46);
    const coneBotY = Math.min(height, fy + height * 0.46);

    // 1. Fill triangular cone with soft architectural light haze (brightest at tip)
    const coneFillGrad = ctx.createLinearGradient(0, fy, fx, fy);
    if (!isDark) {
      coneFillGrad.addColorStop(0, 'rgba(37, 99, 235, 0.005)');
      coneFillGrad.addColorStop(0.60, 'rgba(14, 165, 233, 0.035)');
      coneFillGrad.addColorStop(0.85, 'rgba(37, 99, 235, 0.10)');
      coneFillGrad.addColorStop(1.0, 'rgba(37, 99, 235, 0.22)');
    } else {
      coneFillGrad.addColorStop(0, 'rgba(255, 255, 255, 0.005)');
      coneFillGrad.addColorStop(0.65, 'rgba(230, 240, 255, 0.035)');
      coneFillGrad.addColorStop(0.90, 'rgba(240, 248, 255, 0.12)');
      coneFillGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.32)');
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, coneTopY);
    ctx.lineTo(fx, fy);
    ctx.lineTo(0, coneBotY);
    ctx.closePath();
    ctx.fillStyle = coneFillGrad;
    ctx.fill();

    // 2. Draw sharp tapered boundary lines of the light cone
    const topEdgeGrad = ctx.createLinearGradient(0, coneTopY, fx, fy);
    const botEdgeGrad = ctx.createLinearGradient(0, coneBotY, fx, fy);

    if (!isDark) {
      topEdgeGrad.addColorStop(0, 'rgba(37, 99, 235, 0.06)');
      topEdgeGrad.addColorStop(0.7, 'rgba(37, 99, 235, 0.35)');
      topEdgeGrad.addColorStop(1, 'rgba(37, 99, 235, 0.85)');

      botEdgeGrad.addColorStop(0, 'rgba(37, 99, 235, 0.06)');
      botEdgeGrad.addColorStop(0.7, 'rgba(37, 99, 235, 0.35)');
      botEdgeGrad.addColorStop(1, 'rgba(37, 99, 235, 0.85)');
    } else {
      topEdgeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      topEdgeGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.22)');
      topEdgeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.75)');

      botEdgeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      botEdgeGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.22)');
      botEdgeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.75)');
    }

    ctx.strokeStyle = topEdgeGrad;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, coneTopY);
    ctx.lineTo(fx, fy);
    ctx.stroke();

    ctx.strokeStyle = botEdgeGrad;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, coneBotY);
    ctx.lineTo(fx, fy);
    ctx.stroke();
    ctx.restore();

    // B. Draw Radiating Streamlines (Subtle background paths)
    ctx.lineWidth = 0.65;
    for (let i = 0; i < rays.length; i++) {
      const r = rays[i];

      const grad = ctx.createLinearGradient(r.x0, r.y0, r.x1, r.y1);
      if (!isDark) {
        grad.addColorStop(0, 'rgba(203, 213, 225, 0.30)');
        grad.addColorStop(0.70, 'rgba(147, 197, 253, 0.35)');
        grad.addColorStop(1, 'rgba(37, 99, 235, 0.45)');
      } else {
        grad.addColorStop(0, 'rgba(22, 34, 56, 0.10)');
        grad.addColorStop(0.70, 'rgba(37, 99, 235, 0.22)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.50)');
      }

      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(r.x0, r.y0);
      ctx.lineTo(r.x1, r.y1);
      ctx.stroke();
    }

    // C. Draw Clean Horizontal Laser Beam (Pinch Point all the way to Right Edge)
    const beamGrad = ctx.createLinearGradient(fx, fy, width, fy);
    if (!isDark) {
      beamGrad.addColorStop(0, 'rgba(37, 99, 235, 0.95)');
      beamGrad.addColorStop(0.12, 'rgba(37, 99, 235, 0.85)');
      beamGrad.addColorStop(0.60, 'rgba(2, 132, 199, 0.50)');
      beamGrad.addColorStop(1, 'rgba(37, 99, 235, 0.10)');
    } else {
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      beamGrad.addColorStop(0.12, 'rgba(255, 255, 255, 0.85)');
      beamGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.45)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
    }

    ctx.strokeStyle = beamGrad;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(width, fy);
    ctx.stroke();

    // D. Ambient Background Comets
    ctx.fillStyle = isDark ? '#7dd3fc' : '#2563eb';
    for (let i = 0; i < ambientComets.length; i++) {
      const c = ambientComets[i];
      c.t += c.speed;
      if (c.t > 1.0) c.t = 0.0;

      const px = c.t * fx;
      const py = c.yLeft + (fy - c.yLeft) * c.t;

      ctx.globalAlpha = Math.sin(c.t * Math.PI) * (isDark ? 0.35 : 0.28);
      ctx.beginPath();
      ctx.arc(px, py, c.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // E. Ambient Continuous Trickle from Aarkin Logo
    if (Math.random() < 0.15 && particles.length > 0) {
      const randIdx = Math.floor(Math.random() * particles.length);
      const randP = particles[randIdx];
      if (randP && randP.state === 'resting') {
        randP.state = 'forward';
        randP.progress = 0;
      }
    }

    // F. Update & Draw Particles (Ease-In Acceleration + Circulating Loop)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (p.state === 'forward') {
        p.progress += p.speed;

        p.prevX = p.x;
        p.prevY = p.y;

        // Quadratic Ease-In: Starts SLOW at logo, ACCELERATES FAST into pinch point
        const t = Math.min(1.0, p.progress);
        const easeIn = t * t;

        p.x = p.baseX + (fx - p.baseX) * easeIn;
        p.y = p.baseY + (fy - p.baseY) * easeIn;

        // Glowing streak trail
        ctx.strokeStyle = isDark ? 'rgba(125, 211, 252, 0.70)' : 'rgba(37, 99, 235, 0.80)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#ffffff' : '#1d4ed8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseSize * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Arrived at focal pinch point!
        if (p.progress >= 1.0) {
          focalBurst = 1.0;

          // Only release next badge if minimum clearance & interval conditions are satisfied!
          if (mouse.hasPendingTrigger && canSpawnNextIcon()) {
            spawnNextIcon();
            mouse.hasPendingTrigger = false;
          }

          // Transition to RETURN circulating path back to "A"
          p.state = 'returning';
          p.progress = 0;
        }
      } else if (p.state === 'returning') {
        p.progress += p.speed * 0.95;

        const t = Math.min(1.0, p.progress);
        const easeOut = 1 - (1 - t) * (1 - t);

        const directX = fx + (p.baseX - fx) * easeOut;
        const directY = fy + (p.baseY - fy) * easeOut;
        const arch = Math.sin(t * Math.PI) * p.archHeight;

        p.prevX = p.x;
        p.prevY = p.y;
        p.x = directX;
        p.y = directY + arch;

        // Soft return trail
        ctx.strokeStyle = isDark ? 'rgba(37, 99, 235, 0.35)' : 'rgba(2, 132, 199, 0.40)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#7dd3fc' : '#0284c7';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseSize, 0, Math.PI * 2);
        ctx.fill();

        if (p.progress >= 1.0) {
          p.state = 'resting';
          p.progress = 0;
          p.x = p.baseX;
          p.y = p.baseY;
        }
      } else {
        // Resting particle in the Aarkin logo
        const twinkle = 0.88 + 0.12 * Math.sin(now * 0.003 + p.id);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * twinkle;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    // G. Ambient automatic cadence (ensures at least 1-2 icons flowing gracefully with full spacing)
    if (now - lastAutoSpawnTime > 6000) {
      lastAutoSpawnTime = now;
      if (canSpawnNextIcon() && activeIcons.length < 3) {
        spawnNextIcon();
      }
    }

    // ========================================================================
    // H. Sharp Focal Pinch Vertex Tip (Supports Light & Dark)
    // ========================================================================
    focalBurst *= 0.90;
    const vertexR = 7 + focalBurst * 6;

    const tipGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, vertexR);
    if (!isDark) {
      tipGrad.addColorStop(0, '#1d4ed8');
      tipGrad.addColorStop(0.35, '#2563eb');
      tipGrad.addColorStop(0.75, 'rgba(56, 189, 248, 0.45)');
      tipGrad.addColorStop(1.0, 'rgba(37, 99, 235, 0)');
    } else {
      tipGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      tipGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.75)');
      tipGrad.addColorStop(0.75, 'rgba(230, 245, 255, 0.20)');
      tipGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
    }

    ctx.fillStyle = tipGrad;
    ctx.beginPath();
    ctx.arc(fx, fy, vertexR, 0, Math.PI * 2);
    ctx.fill();

    // I. Update Sequential 3D Tech Badges along the full beam with zero overlap
    updateActiveIcons(delta);
  }

  requestAnimationFrame(render);
  console.log('AARK Innovations Streamline Engine with Zero Overlap & Light/Dark Theme ready.');
})();
