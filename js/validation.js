/**
 * Stackly Accounting & Finance - Client-Side Form Validation (validation.js)
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Consultation Form (Contact Page)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('consultation-form');
  const typeBtns = document.querySelectorAll('.form-type-btn');
  const categoryInput = document.getElementById('selected-service-category');

  if (typeBtns && categoryInput) {
    typeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        categoryInput.value = btn.getAttribute('data-type');
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Full Name
      const nameInput = document.getElementById('full-name');
      const nameError = document.getElementById('name-error');
      if (nameInput) {
        if (!nameInput.value.trim()) {
          showError(nameInput, nameError, 'Please enter your full name.');
          isValid = false;
        } else {
          clearError(nameInput, nameError);
        }
      }

      // Validate Email
      const emailInput = document.getElementById('business-email');
      const emailError = document.getElementById('email-error');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput) {
        if (!emailInput.value.trim()) {
          showError(emailInput, emailError, 'Business email is required.');
          isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
          showError(emailInput, emailError, 'Please enter a valid email address.');
          isValid = false;
        } else {
          clearError(emailInput, emailError);
        }
      }

      // Validate Company Name
      const companyInput = document.getElementById('company-name');
      const companyError = document.getElementById('company-error');
      if (companyInput) {
        if (!companyInput.value.trim()) {
          showError(companyInput, companyError, 'Company name is required.');
          isValid = false;
        } else {
          clearError(companyInput, companyError);
        }
      }

      // Validate Message
      const messageInput = document.getElementById('message');
      const messageError = document.getElementById('message-error');
      if (messageInput) {
        if (!messageInput.value.trim()) {
          showError(messageInput, messageError, 'Please tell us a bit about your business and goals.');
          isValid = false;
        } else {
          clearError(messageInput, messageError);
        }
      }

      // Validate Consent Checkbox
      const consentCheckbox = document.getElementById('consent-checkbox');
      const consentError = document.getElementById('consent-error');
      if (consentCheckbox) {
        if (!consentCheckbox.checked) {
          if (consentError) consentError.style.display = 'block';
          isValid = false;
        } else {
          if (consentError) consentError.style.display = 'none';
        }
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0110 10" stroke-linecap="round"></path>
            </svg>
          `;
        }

        setTimeout(() => {
          window.location.href = '404.html';
        }, 300);
      }
    });

    ['full-name', 'business-email', 'company-name', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          el.classList.remove('error');
          const errEl = document.getElementById(`${id.replace('full-', '').replace('business-', '').replace('company-', '')}-error`);
          if (errEl) errEl.classList.remove('visible');
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Generic Password Visibility Toggle
  // --------------------------------------------------------------------------
  function attachPasswordToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (btn && input) {
      btn.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        btn.innerHTML = isPassword ? `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        ` : `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      });
    }
  }

  attachPasswordToggle('password-toggle', 'login-password');
  attachPasswordToggle('password-toggle-signup', 'signup-password');
  attachPasswordToggle('confirm-password-toggle-signup', 'signup-confirm-password');

  // --------------------------------------------------------------------------
  // 3. Login Role Selector & Form Submission
  // --------------------------------------------------------------------------
  const loginForm = document.getElementById('login-form');
  const loginRoleUserBtn = document.getElementById('login-role-user');
  const loginRoleAdminBtn = document.getElementById('login-role-admin');
  const loginRoleInput = document.getElementById('login-selected-role');
  const loginTitle = document.getElementById('login-form-title');
  const loginSubtitle = document.getElementById('login-form-subtitle');
  const loginEmailInput = document.getElementById('login-email');
  const loginSubmitBtn = document.getElementById('login-submit');

  if (loginRoleUserBtn && loginRoleAdminBtn && loginRoleInput) {
    loginRoleUserBtn.addEventListener('click', () => {
      loginRoleInput.value = 'user';
      loginRoleUserBtn.classList.add('active');
      loginRoleAdminBtn.classList.remove('active');
      if (loginTitle) loginTitle.textContent = 'Sign in to Stackly.';
      if (loginSubtitle) loginSubtitle.textContent = 'Enter your account details to continue.';
      if (loginEmailInput) loginEmailInput.placeholder = 'Enter your email address';
      if (loginSubmitBtn) {
        loginSubmitBtn.innerHTML = `
          <span>SIGN IN</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
    });

    loginRoleAdminBtn.addEventListener('click', () => {
      loginRoleInput.value = 'admin';
      loginRoleAdminBtn.classList.add('active');
      loginRoleUserBtn.classList.remove('active');
      if (loginTitle) loginTitle.textContent = 'Practice Partner Sign In.';
      if (loginSubtitle) loginSubtitle.textContent = 'Enter your practice administrator credentials.';
      if (loginEmailInput) loginEmailInput.placeholder = 'admin@stackly.com';
      if (loginSubmitBtn) {
        loginSubmitBtn.innerHTML = `
          <span>SIGN IN AS ADMIN</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
    });
  }

  if (loginForm) {
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginEmailError = document.getElementById('login-email-error');
    const loginPasswordError = document.getElementById('login-password-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (loginEmail) {
      loginEmail.addEventListener('input', () => {
        loginEmail.classList.remove('error');
        if (loginEmailError) loginEmailError.classList.remove('visible');
      });
    }
    if (loginPassword) {
      loginPassword.addEventListener('input', () => {
        loginPassword.classList.remove('error');
        if (loginPasswordError) loginPasswordError.classList.remove('visible');
      });
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Email
      if (!loginEmail || !loginEmail.value.trim()) {
        showError(loginEmail, loginEmailError, 'Please enter your registered email address.');
        isValid = false;
      } else if (!emailRegex.test(loginEmail.value.trim())) {
        showError(loginEmail, loginEmailError, 'Please enter a valid business email address.');
        isValid = false;
      } else {
        clearError(loginEmail, loginEmailError);
      }

      // Validate Password
      if (!loginPassword || !loginPassword.value.trim()) {
        showError(loginPassword, loginPasswordError, 'Please enter your account password.');
        isValid = false;
      } else if (loginPassword.value.length < 6) {
        showError(loginPassword, loginPasswordError, 'Password must be at least 6 characters long.');
        isValid = false;
      } else {
        clearError(loginPassword, loginPasswordError);
      }

      if (isValid) {
        const submitBtn = document.getElementById('login-submit') || loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span>Signing in...</span>
            <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0110 10" stroke-linecap="round"></path>
            </svg>
          `;
        }

        const selectedRole = loginRoleInput ? loginRoleInput.value : 'user';
        setTimeout(() => {
          if (selectedRole === 'admin') {
            window.location.href = 'admindashboard.html';
          } else {
            window.location.href = 'userdashboard.html';
          }
        }, 1000);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Signup Role Selector & Form Submission
  // --------------------------------------------------------------------------
  const signupForm = document.getElementById('signup-form');
  const signupRoleUserBtn = document.getElementById('signup-role-user');
  const signupRoleAdminBtn = document.getElementById('signup-role-admin');
  const signupRoleInput = document.getElementById('signup-selected-role');
  const signupTitle = document.getElementById('signup-title');
  const signupSubtitle = document.getElementById('signup-subtitle');
  const signupSubmitBtn = document.getElementById('signup-submit');

  if (signupRoleUserBtn && signupRoleAdminBtn && signupRoleInput) {
    signupRoleUserBtn.addEventListener('click', () => {
      signupRoleInput.value = 'user';
      signupRoleUserBtn.classList.add('active');
      signupRoleAdminBtn.classList.remove('active');
      if (signupTitle) signupTitle.textContent = 'Create your Stackly account.';
      if (signupSubtitle) signupSubtitle.textContent = 'Enter your details to get started with seamless accounting.';
      if (signupSubmitBtn) {
        signupSubmitBtn.innerHTML = `
          <span>Create Account</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
    });

    signupRoleAdminBtn.addEventListener('click', () => {
      signupRoleInput.value = 'admin';
      signupRoleAdminBtn.classList.add('active');
      signupRoleUserBtn.classList.remove('active');
      if (signupTitle) signupTitle.textContent = 'Create Practice Partner account.';
      if (signupSubtitle) signupSubtitle.textContent = 'Register firm credentials for practice management.';
      if (signupSubmitBtn) {
        signupSubmitBtn.innerHTML = `
          <span>Create Admin Account</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
    });
  }

  if (signupForm) {
    const signupName = document.getElementById('signup-name');
    const signupEmail = document.getElementById('signup-email');
    const signupBusiness = document.getElementById('signup-business');
    const signupPhone = document.getElementById('signup-phone');
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');
    const signupTerms = document.getElementById('signup-terms');

    const nameError = document.getElementById('signup-name-error');
    const emailError = document.getElementById('signup-email-error');
    const businessError = document.getElementById('signup-business-error');
    const phoneError = document.getElementById('signup-phone-error');
    const passwordError = document.getElementById('signup-password-error');
    const confirmPasswordError = document.getElementById('signup-confirm-password-error');
    const termsError = document.getElementById('signup-terms-error');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\(\)\-\+\.]{7,20}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    // Real-time error clearing
    [
      [signupName, nameError],
      [signupEmail, emailError],
      [signupBusiness, businessError],
      [signupPhone, phoneError, document.querySelector('.signup-phone-group')],
      [signupPassword, passwordError],
      [signupConfirmPassword, confirmPasswordError]
    ].forEach(([input, errorEl, container]) => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('error');
          if (container) container.classList.remove('error');
          if (errorEl) errorEl.classList.remove('visible');
        });
      }
    });

    if (signupTerms) {
      signupTerms.addEventListener('change', () => {
        if (signupTerms.checked && termsError) {
          termsError.classList.remove('visible');
        }
      });
    }

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Full Name
      if (!signupName || !signupName.value.trim()) {
        showError(signupName, nameError, 'Full name is required.');
        isValid = false;
      } else {
        clearError(signupName, nameError);
      }

      // Work Email
      if (!signupEmail || !signupEmail.value.trim()) {
        showError(signupEmail, emailError, 'Work email address is required.');
        isValid = false;
      } else if (!emailRegex.test(signupEmail.value.trim())) {
        showError(signupEmail, emailError, 'Please enter a valid work email address.');
        isValid = false;
      } else {
        clearError(signupEmail, emailError);
      }

      // Business Name
      if (!signupBusiness || !signupBusiness.value.trim()) {
        showError(signupBusiness, businessError, 'Business name is required.');
        isValid = false;
      } else {
        clearError(signupBusiness, businessError);
      }

      // Phone Number
      const phoneGroup = document.querySelector('.signup-phone-group');
      if (!signupPhone || !signupPhone.value.trim()) {
        if (phoneGroup) phoneGroup.classList.add('error');
        showError(signupPhone, phoneError, 'Phone number is required.');
        isValid = false;
      } else if (!phoneRegex.test(signupPhone.value.trim())) {
        if (phoneGroup) phoneGroup.classList.add('error');
        showError(signupPhone, phoneError, 'Please enter a valid phone number.');
        isValid = false;
      } else {
        if (phoneGroup) phoneGroup.classList.remove('error');
        clearError(signupPhone, phoneError);
      }

      // Password
      if (!signupPassword || !signupPassword.value) {
        showError(signupPassword, passwordError, 'Password is required.');
        isValid = false;
      } else if (!passwordRegex.test(signupPassword.value)) {
        showError(signupPassword, passwordError, 'Must be at least 8 characters and include a number and symbol.');
        isValid = false;
      } else {
        clearError(signupPassword, passwordError);
      }

      // Confirm Password
      if (!signupConfirmPassword || !signupConfirmPassword.value) {
        showError(signupConfirmPassword, confirmPasswordError, 'Please confirm your password.');
        isValid = false;
      } else if (signupConfirmPassword.value !== signupPassword.value) {
        showError(signupConfirmPassword, confirmPasswordError, 'Passwords do not match.');
        isValid = false;
      } else {
        clearError(signupConfirmPassword, confirmPasswordError);
      }

      // Terms Checkbox
      if (signupTerms && !signupTerms.checked) {
        if (termsError) {
          termsError.textContent = 'You must agree to the Terms of Service and Privacy Policy.';
          termsError.classList.add('visible');
        }
        isValid = false;
      } else if (termsError) {
        termsError.classList.remove('visible');
      }

      if (isValid) {
        const submitBtn = document.getElementById('signup-submit') || signupForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span>Creating Account...</span>
            <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0110 10" stroke-linecap="round"></path>
            </svg>
          `;
        }

        const selectedRole = signupRoleInput ? signupRoleInput.value : 'user';
        setTimeout(() => {
          if (selectedRole === 'admin') {
            window.location.href = 'admindashboard.html';
          } else {
            window.location.href = 'userdashboard.html';
          }
        }, 1200);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  function showError(input, errorEl, msg) {
    input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    }
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
