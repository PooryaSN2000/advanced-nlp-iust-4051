/**
 * Advanced NLP (IUST - Semester 4051)
 * Main JavaScript: Mobile Nav Drawer, Filter Chips, Hash Anchoring, Accordions, Toasts, Copy Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNavLink();
  initScheduleFilters();
  initMaterialTabs();
  initTeamHashScroll();
  initAccordions();
  initCopyButtons();
});

/* ==========================================================================
   Mobile Navigation Drawer (Touch Friendly & Bulletproof)
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    const hamburgerSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    const closeSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    function closeMenu() {
      navLinks.classList.remove('open');
      document.body.classList.remove('no-scroll');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = hamburgerSVG;
    }

    function openMenu() {
      navLinks.classList.add('open');
      document.body.classList.add('no-scroll');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.innerHTML = closeSVG;
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });
  }
}

/* ==========================================================================
   Active Navigation Link Detection
   ========================================================================== */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   Schedule Filter Chips (Bulletproof Event Delegation & Direct Class Toggle)
   ========================================================================== */
function initScheduleFilters() {
  const filterWrap = document.querySelector('.filter-chips');
  const cards = document.querySelectorAll('.schedule-card');

  if (!filterWrap || !cards.length) return;

  filterWrap.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-schedule-filter]');
    if (!chip) return;

    filterWrap.querySelectorAll('.chip-btn').forEach(btn => btn.classList.remove('active'));
    chip.classList.add('active');

    const filterVal = chip.getAttribute('data-schedule-filter');
    cards.forEach(card => {
      const cardType = card.getAttribute('data-type');
      if (filterVal === 'all' || cardType === filterVal) {
        card.style.setProperty('display', 'flex', 'important');
      } else {
        card.style.setProperty('display', 'none', 'important');
      }
    });
  });
}

/* ==========================================================================
   Materials Filter Tabs
   ========================================================================== */
function initMaterialTabs() {
  const tabsWrap = document.querySelector('.resource-tabs');
  const cards = document.querySelectorAll('.resource-card');

  if (!tabsWrap || !cards.length) return;

  tabsWrap.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.resource-tab-btn');
    if (!tabBtn) return;

    tabsWrap.querySelectorAll('.resource-tab-btn').forEach(b => b.classList.remove('active'));
    tabBtn.classList.add('active');

    const selectedTab = tabBtn.getAttribute('data-tab');
    cards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (selectedTab === 'all' || cat === selectedTab) {
        card.style.setProperty('display', 'flex', 'important');
      } else {
        card.style.setProperty('display', 'none', 'important');
      }
    });
  });
}

/* ==========================================================================
   Presenter Anchor Navigation & Team Card Highlight Effect
   ========================================================================== */
function initTeamHashScroll() {
  function scrollToCard() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      try {
        const targetElement = document.querySelector(hash);
        if (targetElement && targetElement.classList.contains('team-card')) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetElement.classList.add('highlight-pulse');
            setTimeout(() => {
              targetElement.classList.remove('highlight-pulse');
            }, 3500);
          }, 150);
        }
      } catch (err) {
        console.warn('Invalid hash target:', err);
      }
    }
  }

  scrollToCard();
  window.addEventListener('hashchange', scrollToCard);
}

/* ==========================================================================
   Accordion / FAQs
   ========================================================================== */
function initAccordions() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      if (item) {
        item.classList.toggle('active');
      }
    });
  });
}

/* ==========================================================================
   One-Click Copy Utilities (BibTeX & Code)
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy-target]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const textToCopy = targetEl.innerText || targetEl.textContent;
        navigator.clipboard.writeText(textToCopy.trim()).then(() => {
          showToast('Copied to clipboard!');
        }).catch(() => {
          showToast('Failed to copy');
        });
      }
    });
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, duration = 2500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease-in';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}
