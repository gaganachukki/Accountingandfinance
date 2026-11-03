/**
 * Finora Accounting & Finance - Interactive Functionality
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? `
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      ` : `
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      `;
    });

    // Close on navigation click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = `
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        `;
      });
    });
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');

    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items for clean accordion behavior
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherPanel = otherItem.querySelector('.faq-answer-panel');
            if (otherPanel) {
              otherPanel.style.maxHeight = null;
            }
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answerPanel.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
        }
      });
    }
  });

  // Open the first FAQ by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstPanel = firstItem.querySelector('.faq-answer-panel');
    firstItem.classList.add('active');
    if (firstPanel) {
      firstPanel.style.maxHeight = firstPanel.scrollHeight + 'px';
    }
  }

  // 4. Interactive Dashboard Showcase Timeframe Switcher
  const timeframeBtns = document.querySelectorAll('.timeframe-btn');
  const kpiRevenue = document.getElementById('kpi-revenue');
  const kpiExpenses = document.getElementById('kpi-expenses');
  const kpiMargin = document.getElementById('kpi-margin');
  const showcaseBars = document.querySelectorAll('.bar-dual');

  const timeframeData = {
    '30d': {
      revenue: '$248,500',
      expenses: '$162,100',
      margin: '34.8%',
      bars: ['45%', '65%', '50%', '80%', '95%', '88%']
    },
    'q3': {
      revenue: '$742,000',
      expenses: '$480,300',
      margin: '35.2%',
      bars: ['60%', '75%', '70%', '85%', '92%', '100%']
    },
    'ytd': {
      revenue: '$2,140,800',
      expenses: '$1,378,500',
      margin: '35.6%',
      bars: ['50%', '60%', '72%', '78%', '88%', '96%']
    }
  };

  timeframeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeframeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const period = btn.getAttribute('data-period');
      const data = timeframeData[period];

      if (data) {
        if (kpiRevenue) kpiRevenue.textContent = data.revenue;
        if (kpiExpenses) kpiExpenses.textContent = data.expenses;
        if (kpiMargin) kpiMargin.textContent = data.margin;

        if (showcaseBars && showcaseBars.length === data.bars.length) {
          showcaseBars.forEach((bar, index) => {
            bar.style.height = data.bars[index];
          });
        }
      }
    });
  });
  // 5. Hero Background Cover Fade Loop (3 WebP Images under 90KB)
  const heroSlides = document.querySelectorAll('.hero-bg-slide');
  if (heroSlides.length > 1) {
    let currentHeroSlide = 0;
    setInterval(() => {
      heroSlides[currentHeroSlide].classList.remove('active');
      currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
      heroSlides[currentHeroSlide].classList.add('active');
    }, 5500);
  }
});