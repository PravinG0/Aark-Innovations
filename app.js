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

})();
