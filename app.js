/**
 * AARK INNOVATIONS &mdash; MASTER UNIFIED APPLICATION SCRIPT
 * Sections Merged:
 *   - Folder 3.1: Two-Step Notch Navigation & Hero Proof Controllers
 *   - Folder Aarkinn 4: Section 04 Line-Draw Reveal & Automatic SVG Animations
 *   - Folder Aarkinn 5: Section 05 Micro-Animated Service Rows & Arrow Tracking
 */

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.is-drawable').forEach(el => el.classList.add('is-in'));
    initNavigation();
    initScrollRevealPaths();
    initPlatformRowInteractions();
    initZoomCards();
    initBannerInteractions();
    initJourney();
  });

  /* =========================================================================
     1. TWO-STEP NOTCH NAVIGATION CONTROLLER (FROM 3.1)
     ========================================================================= */
  function initNavigation() {
    const nav = document.getElementById('twostep-nav');
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const backdrop = document.getElementById('nav-backdrop');

    if (!nav || !toggleBtn) return;

    let isNavOpen = false;

    function toggleNav(forceState) {
      isNavOpen = typeof forceState === 'boolean' ? forceState : !isNavOpen;
      nav.setAttribute('data-nav-status', isNavOpen ? 'open' : 'closed');
      toggleBtn.setAttribute('aria-expanded', isNavOpen ? 'true' : 'false');
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        if (isNavOpen) toggleNav(false);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isNavOpen) {
        toggleNav(false);
      }
    });

    const navLinks = document.querySelectorAll('.twostep-link, .twostep-barCta, .product-learn-btn');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (isNavOpen) toggleNav(false);
      });
    });
  }

  /* =========================================================================
     2. SECTION 04 LINE-DRAWING SVG REVEAL (FROM AARKINN 4)
     ========================================================================= */
  function initScrollRevealPaths() {
    const practiceCards = document.querySelectorAll('.hx-path');
    if (!practiceCards.length) return;

    practiceCards.forEach((card) => {
      const paths = card.querySelectorAll('.hx-ln');
      paths.forEach((path) => {
        const length = path.getTotalLength ? path.getTotalLength() : 100;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const paths = entry.target.querySelectorAll('.hx-ln');
              paths.forEach((p) => {
                p.style.strokeDashoffset = '0';
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      practiceCards.forEach((card) => observer.observe(card));
    } else {
      practiceCards.forEach((card) => {
        const paths = card.querySelectorAll('.hx-ln');
        paths.forEach((p) => (p.style.strokeDashoffset = '0'));
      });
    }

    // Card Hover Interaction
    practiceCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const paths = card.querySelectorAll('.hx-ln');
        paths.forEach((p) => (p.style.stroke = 'var(--color-primary, #1e40af)'));
      });

      card.addEventListener('mouseleave', () => {
        const paths = card.querySelectorAll('.hx-ln');
        paths.forEach((p) => (p.style.stroke = ''));
      });
    });
  }

  /* =========================================================================
     3. SECTION 05 SERVICE ROW INTERACTIONS & ARROW TRACKING (FROM AARKINN 5)
     ========================================================================= */
  function initPlatformRowInteractions() {
    const rows = document.querySelectorAll('.re-service');
    if (!rows.length) return;

    rows.forEach((row) => {
      const arrow = row.querySelector('.re-service-arrow');

      row.addEventListener('mousemove', (e) => {
        if (!arrow) return;
        const rect = row.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        arrow.style.transform = `translate(${5 + x * 10}px, ${-5 + y * 8}px) scale(1.15)`;
      });

      row.addEventListener('mouseleave', () => {
        if (!arrow) return;
        arrow.style.transform = '';
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const target = document.querySelector('#contact');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  /* =========================================================================
     4. SECTION 06 ZOOM CARDS INTERACTION (EXPAND / REVEAL FLIP)
     ========================================================================= */
  function initZoomCards() {
    const cards = document.querySelectorAll('.fwrd-zoom-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-expanded', 'false');

      // Click handler
      card.addEventListener('click', (e) => {
        toggleZoomCard(card);
      });

      // Keyboard support (Space & Enter)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleZoomCard(card);
        }
      });
    });
  }

  function toggleZoomCard(card) {
    const isExpanded = card.classList.contains('is-active');

    if (isExpanded) {
      card.classList.remove('is-active');
      card.setAttribute('aria-expanded', 'false');
    } else {
      card.classList.add('is-active');
      card.setAttribute('aria-expanded', 'true');
    }
  }

  /* =========================================================================
     5. SECTION 06 STAT BANNER INTERACTIONS
     ========================================================================= */
  function initBannerInteractions() {
    const items = document.querySelectorAll('.stat-banner__item');
    if (!items.length) return;

    items.forEach((item) => {
      item.addEventListener('click', () => {
        item.style.transform = 'translateX(8px) scale(1.02)';
        setTimeout(() => {
          item.style.transform = '';
        }, 250);
      });
    });
  }

  /* =========================================================================
     6. SECTION 10 JOURNEY CONTROLLER (FROM AARKINN 7)
     Scroll-driven SVG Serpentine Progress & Traveling Pulse Radar Marker
     ========================================================================= */
  function initJourney() {
    const root = document.querySelector('.journey');
    if (!root) return;

    const svg = root.querySelector('.journey-svg');
    const progress = root.querySelector('.journey-svg-progress');
    const marker = root.querySelector('.journey-marker');
    const stage = root.querySelector('.journey-stage');
    const nodes = Array.from(root.querySelectorAll('.journey-node'));
    const cards = Array.from(root.querySelectorAll('.journey-card'));

    if (!svg || !progress || !stage || nodes.length === 0) return;

    const L = progress.getTotalLength();
    svg.style.setProperty('--path-len', L);
    progress.style.strokeDasharray = L;

    const vb = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width ? svg.viewBox.baseVal.width : 302;
    let nodeCentre = [];
    let nodeLen = [];

    // Compute exact center coordinates of each milestone node in SVG user units
    const measure = () => {
      const cs = getComputedStyle(svg);
      const sx = parseFloat(cs.left) || 0;
      const sy = parseFloat(cs.top) || 0;
      const sw = parseFloat(cs.width) || vb;
      const scale = sw / vb; // CSS px per SVG user unit

      nodeCentre = nodes.map(n => ({
        x: (n.offsetLeft + n.offsetWidth / 2 - sx) / scale,
        y: (n.offsetTop + n.offsetHeight / 2 - sy) / scale
      }));

      // Map each node center to nearest sampled point along the curve length
      nodeLen = nodeCentre.map(c => {
        let best = 0;
        let bd = Infinity;
        for (let l = 0; l <= L; l += 4) {
          const pt = progress.getPointAtLength(l);
          const d = (pt.x - c.x) * (pt.x - c.x) + (pt.y - c.y) * (pt.y - c.y);
          if (d < bd) {
            bd = d;
            best = l;
          }
        }
        return best;
      });
    };

    measure();

    // Position the 4-ring radar marker on the target milestone node
    const placeMarker = (i) => {
      const c = nodeCentre[i];
      if (!c || !marker) return;
      marker.setAttribute('transform', `translate(${c.x.toFixed(2)} ${c.y.toFixed(2)})`);
    };

    let lastActive = -1;
    const remeasure = () => {
      measure();
      if (lastActive >= 0) placeMarker(lastActive);
    };

    window.addEventListener('resize', remeasure);
    window.addEventListener('load', remeasure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(remeasure);
    }

    // Smooth click navigation on milestone nodes
    nodes.forEach((node, idx) => {
      node.style.cursor = 'pointer';
      node.addEventListener('click', () => {
        const card = cards[idx];
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    let ticking = false;

    const update = () => {
      ticking = false;

      // Mobile: fill the connector under each card as user scrolls
      const fl = window.innerHeight * 0.6;
      cards.forEach(c => {
        const cr = c.getBoundingClientRect();
        const f = Math.max(0, Math.min(1, (fl - cr.bottom) / 48)).toFixed(3);
        if (c.__fill !== f) {
          c.__fill = f;
          c.style.setProperty('--fill', f);
        }
      });

      const rect = svg.getBoundingClientRect();
      const focus = window.innerHeight * 0.55; // viewport reading line

      // Fallback for stacked view on smaller viewports (< 1200px)
      if (!rect.height || window.innerWidth < 1200) {
        let act = -1;
        cards.forEach((c, i) => {
          if (c.getBoundingClientRect().top < window.innerHeight * 0.6) act = i;
        });
        cards.forEach((c, i) => {
          c.classList.toggle('is-active', i === act);
        });
        return;
      }

      const y = focus - rect.top; // pixels scrolled from path top
      const p = Math.max(0, Math.min(1, y / rect.height));
      const len = p * L;
      const dash = (L - len).toFixed(1);

      if (progress.__dash !== dash) {
        progress.__dash = dash;
        progress.style.strokeDashoffset = dash;
      }

      // Determine currently active milestone node
      let active = 0;
      nodeLen.forEach((nl, i) => {
        if (len >= nl - 2) active = i;
      });

      nodes.forEach((n, i) => {
        n.classList.toggle('is-done', i < active);
        n.classList.toggle('is-active', i === active);
      });

      cards.forEach((c, i) => {
        c.classList.toggle('is-active', i === active);
      });

      // Animate radar marker transition to newly active milestone node
      if (active !== lastActive) {
        const first = lastActive === -1;
        lastActive = active;
        if (first) {
          placeMarker(active);
        } else {
          marker.classList.add('is-hidden');
          clearTimeout(marker._t);
          marker._t = setTimeout(() => {
            placeMarker(active);
            marker.classList.remove('is-hidden');
          }, 360);
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Initial render
    placeMarker(0);
    update();
  }

})();
