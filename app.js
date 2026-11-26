/**
 * AARK INNOVATIONS &mdash; MASTER UNIFIED APPLICATION SCRIPT
 * Sections Merged:
 *   - Folder 3.1: Two-Step Notch Navigation & Hero Proof Controllers
 *   - Folder Aarkinn 4: Section 04 Line-Draw Reveal & Automatic SVG Animations
 *   - Folder Aarkinn 5: Section 05 Micro-Animated Service Rows & Arrow Tracking
 */

(() => {
  'use strict';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function decodeHash(hash) { try { return decodeURIComponent(hash.slice(1)); } catch { return hash.slice(1); } }
  // Clean initial load handling: scroll to top on refresh unless valid section hash
  function handleInitialHash() {
    if (window.location.hash && window.location.hash !== '#top' && window.location.hash !== '#') {
      const target = document.getElementById(decodeHash(window.location.hash));
      if (target) {
        setTimeout(() => {
          const navOffset = (document.getElementById('top-navbar')?.getBoundingClientRect().bottom || 64) + 12;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({ top: targetPosition, behavior: 'auto' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }
  window.addEventListener('load', handleInitialHash);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.is-drawable').forEach(el => el.classList.add('is-in'));
    initNavigation();
    initScrollRevealPaths();
    initPlatformRowInteractions();
    initZoomCards();
    initBannerInteractions();
    initConnectedArchitecture();
    initCardHoverFocus();
    initJourney();
    initFaqAccordion();
    initSmoothScroll();
    initContactForm();
    initRoiCalculator();
  });

  /* =========================================================================
     1. FLOATING NAVBAR & MOBILE CONTROLLER (DAPPER REFERENCE)
     ========================================================================= */
  function initNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
        const isOpen = navMenu.classList.contains('is-open');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.querySelectorAll('#nav-menu .nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Accessible keyboard escape and click-outside handler
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.focus();
        }
      });

      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('is-open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          navMenu.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
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
    const rows = document.querySelectorAll('a.re-service[href]');
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
        if (e.key === ' ') { e.preventDefault(); row.click(); }
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
      node.setAttribute('role', 'button');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', node.title || `Journey step ${idx + 1}`);
      node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); node.click(); } });
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

      // Fallback for stacked view on smaller viewports (< 1360px)
      if (!rect.height || window.innerWidth < 1360) {
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

  /* =========================================================================
     7. CONNECTED ARCHITECTURE HUB & SPOKE CONTROLLER (FROM AARKINN 8)
     ========================================================================= */
  function initConnectedArchitecture() {
    const container = document.getElementById('system-diagram-container');
    const svg = document.getElementById('system-connectors-svg');
    const hub = document.getElementById('card-hub');
    const consulting = document.getElementById('card-consulting');
    const strategy = document.getElementById('card-strategy');
    const design = document.getElementById('card-design');
    const delivery = document.getElementById('card-delivery');
    const tagline = document.getElementById('system-tagline-wrap');

    if (!container || !svg || !hub || !consulting || !strategy || !design || !delivery) {
      return;
    }

    const lines = {
      consulting: document.getElementById('line-consulting'),
      strategy: document.getElementById('line-strategy'),
      design: document.getElementById('line-design'),
      delivery: document.getElementById('line-delivery')
    };

    const cards = {
      consulting,
      strategy,
      design,
      delivery
    };

    let offsets = {};

    function measureOffsets() {
      if (window.innerWidth <= 900) {
        Object.values(cards).forEach(c => {
          c.style.transform = '';
          c.style.opacity = '';
        });
        Object.values(lines).forEach(l => {
          if (l) l.style.opacity = '0';
        });
        if (tagline) {
          tagline.style.opacity = '1';
          tagline.style.transform = 'none';
        }
        return;
      }

      Object.values(cards).forEach(c => {
        c.style.transform = '';
        c.style.opacity = '';
      });

      const hubRect = hub.getBoundingClientRect();
      const hubCenterX = hubRect.left + hubRect.width / 2;
      const hubCenterY = hubRect.top + hubRect.height / 2;

      Object.keys(cards).forEach(key => {
        const c = cards[key];
        const rect = c.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        offsets[key] = {
          dx: hubCenterX - cardCenterX,
          dy: hubCenterY - cardCenterY
        };
      });

      applyFrame(currentProgress);
    }

    function calculateProgress() {
      if (window.innerWidth <= 900) return 1;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight * 0.95;
      const end = windowHeight * 0.35;
      const progress = (start - rect.top) / (start - end);
      return Math.min(1, Math.max(0, progress));
    }

    function smoothStep(t) {
      return t * t * (3 - 2 * t);
    }

    function applyFrame(p) {
      if (window.innerWidth <= 900) return;

      const e = smoothStep(p);

      Object.keys(cards).forEach(key => {
        const card = cards[key];
        const offset = offsets[key];
        if (!offset) return;

        const curX = offset.dx * (1 - e);
        const curY = offset.dy * (1 - e);
        const curScale = 0.8 + 0.2 * e;
        const curOpacity = Math.min(1, Math.max(0, e * 2.5));

        card.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) scale(${curScale.toFixed(3)})`;
        card.style.opacity = curOpacity.toFixed(3);
      });

      const containerRect = container.getBoundingClientRect();
      const hubRect = hub.getBoundingClientRect();
      const conRect = consulting.getBoundingClientRect();
      const strRect = strategy.getBoundingClientRect();
      const desRect = design.getBoundingClientRect();
      const delRect = delivery.getBoundingClientRect();

      const hubTL = { x: hubRect.left - containerRect.left, y: hubRect.top - containerRect.top };
      const hubTR = { x: hubRect.right - containerRect.left, y: hubRect.top - containerRect.top };
      const hubBL = { x: hubRect.left - containerRect.left, y: hubRect.bottom - containerRect.top };
      const hubBR = { x: hubRect.right - containerRect.left, y: hubRect.bottom - containerRect.top };

      const conTarget = { x: conRect.right - containerRect.left, y: conRect.bottom - containerRect.top };
      const strTarget = { x: strRect.left - containerRect.left, y: strRect.bottom - containerRect.top };
      const desTarget = { x: desRect.right - containerRect.left, y: desRect.top - containerRect.top };
      const delTarget = { x: delRect.left - containerRect.left, y: delRect.top - containerRect.top };

      const lineConfigs = [
        { line: lines.consulting, origin: hubTL, target: conTarget },
        { line: lines.strategy, origin: hubTR, target: strTarget },
        { line: lines.design, origin: hubBL, target: desTarget },
        { line: lines.delivery, origin: hubBR, target: delTarget }
      ];

      lineConfigs.forEach(({ line, origin, target }) => {
        if (!line) return;

        const curEndX = origin.x + (target.x - origin.x) * e;
        const curEndY = origin.y + (target.y - origin.y) * e;

        line.setAttribute('x1', origin.x.toFixed(1));
        line.setAttribute('y1', origin.y.toFixed(1));
        line.setAttribute('x2', curEndX.toFixed(1));
        line.setAttribute('y2', curEndY.toFixed(1));

        const lineOpacity = Math.min(1, Math.max(0, (e - 0.05) * 1.5));
        line.style.opacity = lineOpacity.toFixed(3);
      });

      if (tagline) {
        const tagE = Math.min(1, Math.max(0, (e - 0.7) / 0.3));
        tagline.style.opacity = tagE.toFixed(3);
        tagline.style.transform = `translate3d(0, ${((1 - tagE) * 15).toFixed(1)}px, 0)`;
      }
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let isTicking = false;

    function renderLoop() {
      currentProgress += (targetProgress - currentProgress) * 0.2;

      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress;
      }

      applyFrame(currentProgress);

      if (Math.abs(targetProgress - currentProgress) > 0.0005) {
        requestAnimationFrame(renderLoop);
      } else {
        isTicking = false;
      }
    }

    function onScroll() {
      targetProgress = calculateProgress();
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(renderLoop);
      }
    }

    let resizeTimer = null;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        measureOffsets();
        targetProgress = calculateProgress();
        currentProgress = targetProgress;
        applyFrame(currentProgress);
      }, 100);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('load', handleResize, { passive: true });

    measureOffsets();
    targetProgress = calculateProgress();
    currentProgress = targetProgress;
    applyFrame(currentProgress);
  }

  function initCardHoverFocus() {
    const cards = document.querySelectorAll('.system-card');

    cards.forEach((card) => {
      const cardType = card.dataset.card;
      const associatedLine = document.getElementById(`line-${cardType}`);

      card.addEventListener('mouseenter', () => {
        if (associatedLine) {
          associatedLine.style.strokeWidth = '2.5px';
          associatedLine.style.strokeDasharray = '6 3';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (associatedLine) {
          associatedLine.style.strokeWidth = '1.5px';
          associatedLine.style.strokeDasharray = '4 4';
        }
      });
    });
  }

  /* =========================================================================
     8. FAQ ACCORDION CONTROLLER
     ========================================================================= */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems || faqItems.length === 0) return;

    const resizeOpenAnswers = () => faqItems.forEach(item => { const answer = item.querySelector('.faq-answer'); if (answer && item.classList.contains('is-open')) answer.style.maxHeight = answer.scrollHeight + 'px'; });
    window.addEventListener('resize', resizeOpenAnswers, {passive:true});
    if (document.fonts) document.fonts.ready.then(resizeOpenAnswers);
    resizeOpenAnswers();
    faqItems.forEach((item) => {
      const questionBtn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!questionBtn || !answer) return;

      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains('is-open')) {
            otherItem.classList.remove('is-open');
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('is-open');
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* =========================================================================
     9. INTERNAL SMOOTH SCROLLING (OFFSET NAVBAR)
     ========================================================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.getElementById(decodeHash(href));
        if (target) {
          e.preventDefault();
          const navOffset = (document.getElementById('top-navbar')?.getBoundingClientRect().bottom || 64) + 12;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({
            top: targetPosition,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
          });

          if (history.pushState) {
            history.replaceState(null, null, href);
          }
        }
      });
    });
  }


  /* =========================================================================
     10. CONTACT FORM CONTROLLER (SUBMISSION & VALIDATION)
     ========================================================================= */
  function initContactForm() {
    const form = document.getElementById('project-contact-form');
    if (!form) return;

    const feedbackMsg = document.getElementById('form-feedback-message');
    const submitBtn = document.getElementById('contact-submit-btn');

    function showFeedback(message, error = false) {
      feedbackMsg.style.display = 'block';
      feedbackMsg.classList.toggle('is-error', error);
      feedbackMsg.textContent = message;
    }
    const initialLabel = submitBtn.innerHTML;
    if (form.dataset.endpoint?.trim()) { const note = form.querySelector('.form-delivery-note'); if (note) note.textContent = 'Submit your enquiry using the form below.'; }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      for (const key of Object.keys(data)) data[key] = String(data[key]).trim();
      if (!data.name || !data.email || !data.message || !form.checkValidity()) {
        form.reportValidity();
        showFeedback('Please enter a valid email and complete all required fields.', true);
        return;
      }
      const endpoint = form.dataset.endpoint?.trim();
      if (endpoint) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        try {
          const response = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(data)});
          if (!response.ok) throw new Error('Submission failed');
          form.reset();
          showFeedback('Thank you! Your enquiry has been submitted.');
        } catch (error) {
          showFeedback('Unable to submit. Your details are still here; please try again or email hello@aarkinn.com.', true);
        } finally { submitBtn.disabled = false; submitBtn.innerHTML = initialLabel; }
      } else {
        const subject = 'Architectural review request — ' + data.name;
        const body = `Full Name: ${data.name}\nWork Email: ${data.email}\nCompany & Core Systems: ${data.company || 'Not provided'}\n\nPrimary Bottleneck to Solve:\n${data.message}`;
        const link = 'mailto:hello@aarkinn.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        showFeedback('Your email draft is ready. Send it from your email app to complete your request. If it does not open, email hello@aarkinn.com directly.');
        window.location.href = link;
      }
    });
  }


  /* =========================================================================
     10. INTERACTIVE ROI & WASTE CALCULATOR CONTROLLER
     ========================================================================= */
  function initRoiCalculator() {
    const workersInput = document.getElementById('calc-workers');
    const hoursInput = document.getElementById('calc-hours');
    const rateInput = document.getElementById('calc-rate');

    if (!workersInput || !hoursInput || !rateInput) return;

    const workersVal = document.getElementById('calc-workers-val');
    const hoursVal = document.getElementById('calc-hours-val');
    const rateVal = document.getElementById('calc-rate-val');

    const totalCostOut = document.getElementById('calc-total-cost');
    const recoverableOut = document.getElementById('calc-recoverable');
    const hoursRestoredOut = document.getElementById('calc-hours-restored');

    function updateCalc() {
      const workers = parseInt(workersInput.value, 10) || 25;
      const hours = parseInt(hoursInput.value, 10) || 8;
      const rate = parseInt(rateInput.value, 10) || 65;

      if (workersVal) workersVal.textContent = workers + ' employees';
      if (hoursVal) hoursVal.textContent = hours + ' hrs / wk';
      if (rateVal) rateVal.textContent = '$' + rate + ' / hr';

      // 52 weeks per year
      const totalCost = workers * hours * rate * 52;
      const recoverable = Math.round(totalCost * 0.60);
      const hoursRestored = Math.round(workers * hours * 52 * 0.60);

      const fmt = (num) => '$' + num.toLocaleString('en-US');
      const fmtHrs = (num) => num.toLocaleString('en-US') + ' hrs / yr';

      if (totalCostOut) totalCostOut.textContent = fmt(totalCost) + ' / yr';
      if (recoverableOut) recoverableOut.textContent = fmt(recoverable) + ' / yr';
      if (hoursRestoredOut) hoursRestoredOut.textContent = fmtHrs(hoursRestored);
    }

    [workersInput, hoursInput, rateInput].forEach(inp => {
      inp.addEventListener('input', updateCalc);
    });

    updateCalc();
  }
})();
