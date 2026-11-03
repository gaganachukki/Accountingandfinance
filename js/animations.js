/**
 * Stackly Accounting & Finance - 3D Perspective, Scroll Animations & Jump Micro-Interactions
 * Vanilla JavaScript (GPU-Accelerated)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Top Reading Scroll Progress Bar
  // ==========================================================================
  let progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.prepend(progressBar);
  }

  const updateProgressBar = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar();

  // ==========================================================================
  // 2. Scroll Reveal Observer with 3D Perspective
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-3d-left, .reveal-3d-right, .reveal-3d-zoom');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');

          // If the element has a badge or pill child, give it an attention jump
          const badge = entry.target.querySelector('.section-badge, .card-badge, .sample-data-tag');
          if (badge) {
            badge.style.animation = 'jumpAttention 0.7s ease 0.3s forwards';
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================================================
  // 3. Interactive 3D Mouse Tilt Effect
  // ==========================================================================
  const tiltSelectors = [
    '.hero-dashboard-card',
    '.feature-strip-card',
    '.service-card',
    '.solution-card',
    '.insight-card',
    '.kpi-card',
    '.pricing-card',
    '.login-card-box',
    '.signup-card-box',
    '[data-tilt]'
  ];

  const tiltCards = document.querySelectorAll(tiltSelectors.join(', '));

  tiltCards.forEach(card => {
    // Only apply on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation angles (max 7 degrees for subtle professional elegance)
        const rotateX = ((y - centerY) / centerY) * -6.5;
        const rotateY = ((x - centerX) / centerX) * 6.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px) scale3d(1.015, 1.015, 1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
      });
    }
  });

  // ==========================================================================
  // 4. Interactive Button Jump Micro-Interactions
  // ==========================================================================
  const jumpButtons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary, .login-cta-btn');

  jumpButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('btn-jump-active');
      setTimeout(() => {
        btn.classList.remove('btn-jump-active');
      }, 600);
    });
  });

  // ==========================================================================
  // 5. Scroll-To-Top Jump Button
  // ==========================================================================
  let scrollTopBtn = document.querySelector('.scroll-top-jump-btn');
  if (!scrollTopBtn && document.querySelector('.site-footer')) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-jump-btn';
    scrollTopBtn.setAttribute('type', 'button');
    scrollTopBtn.setAttribute('aria-label', 'Jump back to top of page');
    scrollTopBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    const toggleScrollTopVisibility = () => {
      if (window.scrollY > 380) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleScrollTopVisibility, { passive: true });
    toggleScrollTopVisibility();
  }

  // ==========================================================================
  // 6. Number Counter Animation
  // ==========================================================================
  const counterElements = document.querySelectorAll('.animate-counter');

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 1800;
          const start = performance.now();

          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentVal = (target * ease).toFixed(decimals);
            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
            }
          }

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.2
    });

    counterElements.forEach(el => counterObserver.observe(el));
  }

});
