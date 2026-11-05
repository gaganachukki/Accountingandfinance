/**
 * auth-session.js - Stackly Authentication & Session Management
 * Handles deriving dynamic user name, first name, and initials from login email
 * and populating dashboards in real-time.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'stackly_logged_in_user';

  /**
   * Parse user profile attributes from an email address
   * e.g. "marcus.sterling@stackly.com" -> { fullName: "Marcus Sterling", firstName: "Marcus", initials: "MS" }
   * e.g. "eleanor.vance@acme.com" -> { fullName: "Eleanor Vance", firstName: "Eleanor", initials: "EV" }
   * e.g. "gaganachukki@outlook.com" -> { fullName: "Gaganachukki", firstName: "Gaganachukki", initials: "G" }
   */
  function parseUserDataFromEmail(email, role = 'user', explicitName = '') {
    if (!email || typeof email !== 'string') return null;
    const cleanEmail = email.trim();
    if (!cleanEmail.includes('@')) return null;

    if (explicitName && explicitName.trim()) {
      const trimmed = explicitName.trim();
      const parts = trimmed.split(/\s+/).filter(Boolean);
      const initials = parts.length >= 2 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() 
        : (parts[0] ? parts[0].slice(0, 1).toUpperCase() : 'U');
      return {
        email: cleanEmail,
        fullName: trimmed,
        firstName: parts[0] || trimmed,
        initials,
        role: role || 'user'
      };
    }

    let userPart = cleanEmail.split('@')[0];
    if (userPart.includes('+')) {
      userPart = userPart.split('+')[0];
    }

    let parts = userPart
      .replace(/[._\-]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\d+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      parts = [userPart.replace(/[^a-zA-Z0-9]/g, '') || 'User'];
    }

    const capitalized = parts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    const fullName = capitalized.join(' ');
    const firstName = capitalized[0];
    const initials = capitalized.length >= 2 
      ? (capitalized[0][0] + capitalized[capitalized.length - 1][0]).toUpperCase() 
      : capitalized[0].charAt(0).toUpperCase();

    return {
      email: cleanEmail,
      fullName,
      firstName,
      initials,
      role: role || 'user'
    };
  }

  /**
   * Save user session to storage
   */
  function saveUserSession(userData) {
    if (!userData || !userData.email) return;
    try {
      const json = JSON.stringify(userData);
      localStorage.setItem(STORAGE_KEY, json);
      sessionStorage.setItem(STORAGE_KEY, json);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  /**
   * Retrieve active user session with fallback for direct dashboard loads
   */
  function getUserSession(fallbackRole = 'user') {
    // 1. Check URL parameters
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        const parsed = parseUserDataFromEmail(emailParam, fallbackRole);
        if (parsed) {
          saveUserSession(parsed);
          return parsed;
        }
      }
    } catch (e) {}

    // 2. Check sessionStorage
    try {
      const s = sessionStorage.getItem(STORAGE_KEY);
      if (s) return JSON.parse(s);
    } catch (e) {}

    // 3. Check localStorage
    try {
      const l = localStorage.getItem(STORAGE_KEY);
      if (l) return JSON.parse(l);
    } catch (e) {}

    // 4. Default fallback when opening dashboard directly without prior login
    if (fallbackRole === 'admin') {
      return {
        email: 'm.sterling@stackly.com',
        fullName: 'Marcus Sterling',
        firstName: 'Marcus',
        initials: 'MS',
        role: 'admin'
      };
    } else {
      return {
        email: 'eleanor@acmefinancial.com',
        fullName: 'Eleanor Vance',
        firstName: 'Eleanor',
        initials: 'EV',
        role: 'user'
      };
    }
  }

  /**
   * Clear session on logout
   */
  function clearUserSession() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  /**
   * Update Admin Dashboard DOM
   */
  function updateAdminDashboard(user) {
    if (!user) return;

    // Sidebar footer name
    const sidebarName = document.getElementById('admin-sidebar-name') || document.querySelector('.admin-partner-name');
    if (sidebarName) sidebarName.textContent = user.fullName;

    // Topbar Profile button
    const profileBtn = document.getElementById('admin-profile-toggle');
    if (profileBtn) {
      profileBtn.setAttribute('title', `${user.fullName} (Managing Partner)`);
    }

    const profileInitial = document.getElementById('admin-profile-initial') || document.querySelector('.admin-profile-initial');
    if (profileInitial) profileInitial.textContent = user.initials;

    // Dropdown elements
    const dropdownAvatar = document.getElementById('admin-dropdown-avatar') || document.querySelector('.admin-profile-avatar-large');
    if (dropdownAvatar) dropdownAvatar.textContent = user.initials;

    const dropdownName = document.getElementById('admin-dropdown-name') || document.querySelector('.admin-profile-name');
    if (dropdownName) dropdownName.textContent = user.fullName;

    const dropdownEmail = document.getElementById('admin-dropdown-email') || document.querySelector('.admin-profile-email');
    if (dropdownEmail) dropdownEmail.textContent = user.email;

    // Settings tab input
    const settingsPartner = document.getElementById('admin-settings-partner-name');
    if (settingsPartner) settingsPartner.value = `${user.fullName}, CPA`;
  }

  /**
   * Update User Dashboard DOM
   */
  function updateUserDashboard(user) {
    if (!user) return;

    // Sidebar footer user profile
    const sidebarInitial = document.getElementById('user-sidebar-initial') || document.querySelector('.user-sidebar-initial');
    if (sidebarInitial) sidebarInitial.textContent = user.initials;

    const sidebarName = document.getElementById('user-sidebar-name') || document.querySelector('.user-sidebar-name');
    if (sidebarName) sidebarName.textContent = user.fullName;

    const sidebarEmail = document.getElementById('user-sidebar-email') || document.querySelector('.user-sidebar-email');
    if (sidebarEmail) sidebarEmail.textContent = user.email;

    // Welcome banner title
    const welcomeTitle = document.getElementById('user-welcome-title');
    if (welcomeTitle) {
      welcomeTitle.innerHTML = `Welcome back, <span id="user-display-firstname">${user.firstName}</span>`;
    }

    const firstNameDisplay = document.getElementById('user-display-firstname');
    if (firstNameDisplay) firstNameDisplay.textContent = user.firstName;

    // Topbar Profile button & initial
    const profileBtn = document.getElementById('user-profile-toggle');
    if (profileBtn) {
      profileBtn.setAttribute('title', `${user.fullName} (Client Account)`);
    }

    const topbarInitials = document.getElementById('user-profile-initial') || document.querySelector('.user-avatar-circle');
    if (topbarInitials) topbarInitials.textContent = user.initials;

    // Dropdown elements
    const dropdownAvatar = document.getElementById('user-dropdown-avatar') || document.querySelector('.user-profile-avatar-large');
    if (dropdownAvatar) dropdownAvatar.textContent = user.initials;

    const dropdownName = document.getElementById('user-dropdown-name') || document.querySelector('.user-profile-name');
    if (dropdownName) dropdownName.textContent = user.fullName;

    const dropdownEmail = document.getElementById('user-dropdown-email') || document.querySelector('.user-profile-email');
    if (dropdownEmail) dropdownEmail.textContent = user.email;

    // Chat section
    const chatFirstName = document.getElementById('chat-client-firstname');
    if (chatFirstName) chatFirstName.textContent = user.firstName;

    const chatFullName = document.getElementById('chat-client-fullname');
    if (chatFullName) chatFullName.textContent = user.fullName;

    // Settings tab
    const settingsName = document.getElementById('user-settings-name');
    if (settingsName) settingsName.value = user.fullName;

    const settingsEmail = document.getElementById('user-settings-email');
    if (settingsEmail) settingsEmail.value = user.email;
  }

  // Attach global object
  window.StacklyAuth = {
    parseUserDataFromEmail,
    saveUserSession,
    getUserSession,
    clearUserSession,
    updateAdminDashboard,
    updateUserDashboard
  };

  // Immediate and DOMContentLoaded execution
  function initDashboard() {
    // If on admin dashboard
    if (document.getElementById('admin-sidebar') || document.getElementById('admin-profile-toggle') || document.querySelector('.admin-topbar')) {
      const user = getUserSession('admin');
      updateAdminDashboard(user);
    }
    // If on user dashboard
    if (document.getElementById('user-sidebar') || document.getElementById('user-profile-toggle') || document.getElementById('tab-overview') || document.querySelector('.user-profile-btn') || document.querySelector('.banner-title')) {
      const user = getUserSession('user');
      updateUserDashboard(user);
    }

    // Attach logout handlers to clear session
    document.querySelectorAll('.admin-logout-btn, .sidebar-logout-btn, .admin-profile-menu-item.logout, .user-profile-menu-item.logout, #user-dropdown-logout').forEach(btn => {
      btn.addEventListener('click', () => {
        clearUserSession();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }

})();
