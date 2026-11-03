/**
 * Stackly Accounting & Finance - Consultation Booking Functionality
 * Interactive Form, Validation, Step Highlighting, Date Picker Constraints
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('consultation-booking-form');
  if (!form) return;

  // 1. Minimum Date constraint for Date Picker (Tomorrow onwards)
  const dateInput = document.getElementById('consult-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // 2. Meeting Format Radio Card Selection
  const formatCards = document.querySelectorAll('.format-card');
  formatCards.forEach(card => {
    card.addEventListener('click', () => {
      formatCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('.format-radio');
      if (radio) radio.checked = true;
    });
  });

  // 3. Service Checkbox Cards Selection
  const serviceCards = document.querySelectorAll('.service-checkbox-card');
  serviceCards.forEach(card => {
    const checkbox = card.querySelector('.checkbox-input');
    
    // Set initial state
    if (checkbox && checkbox.checked) {
      card.classList.add('checked');
    }

    card.addEventListener('click', (e) => {
      // Toggle checked state
      setTimeout(() => {
        if (checkbox.checked) {
          card.classList.add('checked');
        } else {
          card.classList.remove('checked');
        }
      }, 10);
    });
  });

  // 4. Interactive Step Indicator Progress on Scroll/Focus
  const stepPills = [
    document.getElementById('pill-step-1'),
    document.getElementById('pill-step-2'),
    document.getElementById('pill-step-3')
  ];

  const fieldsetContact = document.getElementById('fieldset-contact');
  const fieldsetProfile = document.getElementById('fieldset-profile');
  const fieldsetServices = document.getElementById('fieldset-services');

  const updateActiveStep = (stepIdx) => {
    stepPills.forEach((pill, idx) => {
      if (pill) {
        if (idx <= stepIdx) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      }
    });
  };

  [fieldsetContact, fieldsetProfile, fieldsetServices].forEach((fs, idx) => {
    if (fs) {
      fs.addEventListener('focusin', () => updateActiveStep(idx));
    }
  });

  // 5. Form Validation & Submission
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const companyInput = document.getElementById('contact-company');
  const industrySelect = document.getElementById('business-industry');
  const revenueSelect = document.getElementById('business-revenue');
  const consentCheckbox = document.getElementById('consult-consent');
  const alertBanner = document.getElementById('form-validation-alert');
  const alertText = document.getElementById('alert-message-text');
  const submitBtn = document.getElementById('submit-consult-btn');
  const successModal = document.getElementById('consult-success-modal');
  const confirmedName = document.getElementById('confirmed-name');
  const confirmedEmail = document.getElementById('confirmed-email');
  const confirmedRef = document.getElementById('confirmed-ref');
  const bookAnotherBtn = document.getElementById('book-another-btn');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clearErrors = () => {
    [nameInput, emailInput, companyInput, industrySelect, revenueSelect].forEach(el => {
      if (el) el.classList.remove('field-invalid');
    });
    const customSelectErrors = document.querySelectorAll('.field-error-msg');
    customSelectErrors.forEach(err => err.classList.remove('visible'));
    if (alertBanner) alertBanner.style.display = 'none';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;
    const errors = [];

    // Validate Full Name
    if (!nameInput.value.trim()) {
      nameInput.classList.add('field-invalid');
      errors.push('Full name is required');
      isValid = false;
    }

    // Validate Business Email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      emailInput.classList.add('field-invalid');
      errors.push('Valid business email is required');
      isValid = false;
    }

    // Validate Company Name
    if (!companyInput.value.trim()) {
      companyInput.classList.add('field-invalid');
      errors.push('Company name is required');
      isValid = false;
    }

    // Validate Industry
    if (!industrySelect.value) {
      industrySelect.classList.add('field-invalid');
      const err = document.getElementById('industry-error');
      if (err) err.classList.add('visible');
      errors.push('Please select your industry');
      isValid = false;
    }

    // Validate Revenue
    if (!revenueSelect.value) {
      revenueSelect.classList.add('field-invalid');
      const err = document.getElementById('revenue-error');
      if (err) err.classList.add('visible');
      errors.push('Please select your revenue range');
      isValid = false;
    }

    // Validate Consent
    if (!consentCheckbox.checked) {
      const err = document.getElementById('consent-error');
      if (err) err.style.display = 'block';
      errors.push('Please check the consent box');
      isValid = false;
    }

    if (!isValid) {
      if (alertBanner) {
        alertBanner.style.display = 'flex';
        alertText.textContent = `Please correct the following: ${errors.join(', ')}.`;
        alertBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Submission animation state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnArrow = submitBtn.querySelector('.btn-arrow-icon');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    if (btnText) btnText.textContent = 'CONFIRMING CONSULTATION...';
    if (btnArrow) btnArrow.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Generate random reference ID
      const randomRef = 'STK-' + (new Date().getFullYear()) + '-' + Math.floor(1000 + Math.random() * 9000);
      
      if (confirmedName) confirmedName.textContent = nameInput.value.trim();
      if (confirmedEmail) confirmedEmail.textContent = emailInput.value.trim();
      if (confirmedRef) confirmedRef.textContent = randomRef;

      if (successModal) {
        successModal.style.display = 'flex';
      }

      // Reset button state
      if (btnText) btnText.textContent = 'SCHEDULE FREE CONSULTATION';
      if (btnArrow) btnArrow.style.display = 'inline-block';
      if (btnSpinner) btnSpinner.style.display = 'none';
      submitBtn.disabled = false;
    }, 900);
  });

  if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener('click', () => {
      form.reset();
      clearErrors();
      if (successModal) successModal.style.display = 'none';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // 6. Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
