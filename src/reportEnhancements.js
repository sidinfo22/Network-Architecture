const NAV_ITEMS = [
  { href: 'objectives.html', label: 'Company Objectives & Gap Analysis' },
  { href: 'programming.html', label: 'Research & Development' },
  { href: 'assets.html', label: 'Assets, Inventory & Procurement' },
  { href: 'diagrams.html', label: 'Documentation, Diagrams & Topologies' },
  { href: 'deploy.html', label: 'Infrastructure Deployment & Configurations' },
  { href: 'cloud.html', label: 'Hybrid Cloud Infrastructure & Scalability' },
  { href: 'segmentation.html', label: 'Network Segmentation, VLANs & Subnetting' },
  { href: 'cybersecurity.html', label: 'Cybersecurity, Data Protection & HIPAA Compliance' },
  { href: 'voip.html', label: 'Disaster Recovery & Backup Plan' },
];

function getCurrentFileName() {
  const path = window.location.pathname.split('/').pop();
  if (!path) return 'index.html';
  const routeMap = {
    objectives: 'objectives.html',
    assets: 'assets.html',
    deploy: 'deploy.html',
    diagrams: 'diagrams.html',
    segmentation: 'segmentation.html',
    voip: 'voip.html',
    cloud: 'cloud.html',
    programming: 'programming.html',
    cybersecurity: 'cybersecurity.html',
    hippa: 'hippa.html',
  };
  return routeMap[path] || 'index.html';
}

function setupNavigationMenu(root) {
  const hamburger = root.querySelector('.hamburger-menu');
  const dropdown = root.querySelector('.dropdown-menu');
  const dropdownList = dropdown?.querySelector('ul');

  if (!hamburger || !dropdown || !dropdownList) return;

  const currentFile = getCurrentFileName();
  const currentHeading =
    root.querySelector('.intro-section h1')?.textContent?.trim() || 'Home';

  dropdownList.classList.add('index-menu-list');
  dropdownList.innerHTML = '';

  const statusItem = document.createElement('li');
  statusItem.className = 'menu-status';
  statusItem.innerHTML = `
    <span class="menu-status-label">Current Page</span>
    <span class="menu-status-page">${currentHeading}</span>
  `;
  dropdownList.appendChild(statusItem);

  NAV_ITEMS.forEach((navItem) => {
    const item = document.createElement('li');
    item.setAttribute('data-href', navItem.href);
    item.textContent = navItem.label;
    if (navItem.href === currentFile) {
      item.classList.add('current-page-link');
    }
    item.addEventListener('click', () => {
      window.location.href = navItem.href;
    });
    dropdownList.appendChild(item);
  });

  const closeMenu = () => {
    hamburger.classList.remove('active');
    dropdown.classList.remove('active');
  };

  hamburger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    hamburger.classList.toggle('active');
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target) && !hamburger.contains(event.target)) {
      closeMenu();
    }
  });
}

function setupPageFlow(root) {
  const currentFile = getCurrentFileName();
  const currentIndex = NAV_ITEMS.findIndex((item) => item.href === currentFile);
  const stickyHeader = root.querySelector('.sticky-header');

  if (currentIndex === -1 || !stickyHeader || root.querySelector('.page-flow-nav')) return;

  const previousItem =
    currentIndex === 0 ? { href: 'index.html', label: 'Return to Home' } : NAV_ITEMS[currentIndex - 1];
  const nextItem =
    currentIndex === NAV_ITEMS.length - 1
      ? { href: 'index.html', label: 'Return to Home' }
      : NAV_ITEMS[currentIndex + 1];

  const pageFlow = document.createElement('div');
  pageFlow.className = 'page-flow-nav';
  pageFlow.innerHTML = `
    <a class="page-flow-link page-flow-left" href="${previousItem.href}">
      <span class="page-flow-arrow" aria-hidden="true">←</span>
      <span class="page-flow-text">${currentIndex === 0 ? 'Return to Home' : `Previous: ${previousItem.label}`}</span>
    </a>
    <a class="page-flow-link page-flow-right" href="${nextItem.href}">
      <span class="page-flow-text">${currentIndex === NAV_ITEMS.length - 1 ? 'Return to Home' : `Next: ${nextItem.label}`}</span>
      <span class="page-flow-arrow" aria-hidden="true">→</span>
    </a>
  `;
  stickyHeader.insertAdjacentElement('afterend', pageFlow);
}

function setupReportFooterNavigation(root) {
  const currentFile = getCurrentFileName();
  const currentIndex = NAV_ITEMS.findIndex((item) => item.href === currentFile);
  if (currentIndex === -1) return;

  let footerContainer = root.querySelector(
    '.footer-buttons-container, .bottomBtn85-group, .bottomBtn86-group, .cl99-buttonGroup'
  );
  const pageFooter = root.querySelector('.subtle-footer');

  if (!footerContainer && pageFooter) {
    footerContainer = document.createElement('div');
    footerContainer.className = 'footer-buttons-container';
    pageFooter.insertAdjacentElement('beforebegin', footerContainer);
  }

  if (!footerContainer || footerContainer.dataset.enhanced === 'true') return;

  const previousItem =
    currentIndex === 0 ? { href: 'index.html', label: 'Return to Home' } : NAV_ITEMS[currentIndex - 1];
  const nextItem =
    currentIndex === NAV_ITEMS.length - 1
      ? { href: 'index.html', label: 'Return to Home' }
      : NAV_ITEMS[currentIndex + 1];

  const buttons = [];

  if (currentIndex !== 0) {
    buttons.push(`
      <button class="footer-secondary-button report-footer-button" onclick="window.location.href='${previousItem.href}';">
        <span class="report-footer-arrow" aria-hidden="true">←</span>
        <span class="report-footer-label">${previousItem.label}</span>
      </button>
    `);
  }

  buttons.push(`
    <button class="footer-home-button report-footer-button" onclick="window.location.href='index.html';">
      <span class="report-footer-arrow" aria-hidden="true">↑</span>
      <span class="report-footer-label">Return to Home</span>
    </button>
  `);

  if (currentIndex !== NAV_ITEMS.length - 1) {
    buttons.push(`
      <button class="footer-primary-button report-footer-button" onclick="window.location.href='${nextItem.href}';">
        <span class="report-footer-label">${nextItem.label}</span>
        <span class="report-footer-arrow" aria-hidden="true">→</span>
      </button>
    `);
  }

  footerContainer.classList.add('footer-buttons-container', 'report-footer-nav');
  footerContainer.dataset.buttonCount = String(buttons.length);
  footerContainer.innerHTML = buttons.join('');
  footerContainer.dataset.enhanced = 'true';
}

function setupCompactReportFooter(root) {
  const currentFile = getCurrentFileName();
  const currentIndex = NAV_ITEMS.findIndex((item) => item.href === currentFile);
  const pageFooter = root.querySelector('.subtle-footer');
  const reportFooterNav = root.querySelector('.report-footer-nav');

  if (currentIndex === -1 || !pageFooter || root.querySelector('.compact-report-footer')) return;

  const footerShell = document.createElement('section');
  footerShell.className = 'report-page-end';

  const compactFooter = document.createElement('section');
  compactFooter.className = 'compact-report-footer';
  compactFooter.innerHTML = `
    <div class="compact-report-footer-grid">
      <div class="compact-report-footer-block">
        <h3>Quick Navigation</h3>
        <div class="compact-report-links">
          ${NAV_ITEMS.map((item) => `<a href="${item.href}" class="${item.href === currentFile ? 'compact-report-current-link' : ''}">${item.label}</a>`).join('')}
          <a href="index.html" class="compact-report-home-link">Return to Home</a>
        </div>
      </div>
      <div class="compact-report-footer-block compact-report-contact">
        <h3>Contact</h3>
        <p>Reach out for collaboration, project questions, or networking opportunities.</p>
        <div class="compact-report-contact-links">
          <a href="mailto:Sidinfo21@gmail.com">Sidinfo21@gmail.com</a>
          <a href="tel:+15163686457">(516) 368-6457</a>
        </div>
      </div>
    </div>
  `;

  if (reportFooterNav) footerShell.appendChild(reportFooterNav);
  footerShell.appendChild(compactFooter);
  pageFooter.insertAdjacentElement('beforebegin', footerShell);
  footerShell.appendChild(pageFooter);
}

function setupReel(root) {
  const reelContainer = root.querySelector('.reel-container');
  if (!reelContainer || reelContainer.dataset.enhanced) return;

  const repeatedItems = [...NAV_ITEMS, ...NAV_ITEMS];
  reelContainer.innerHTML = repeatedItems
    .map((item) => `<a class="reel-link" href="${item.href}"><i class="fas fa-award"></i>${item.label}</a>`)
    .join('');
  reelContainer.dataset.enhanced = 'true';
}

function setupContactForm(root) {
  const form = root.querySelector('form');
  const modal = root.querySelector('#thankYouModal');
  const modalContent = root.querySelector('.modal-content');
  const closeButton = root.querySelector('.close-button');
  const submitButton = form?.querySelector('input[type="submit"]');

  if (!form || !modal || !modalContent || !closeButton || !submitButton) return;

  function showModal(message) {
    const text = modalContent.querySelector('p');
    if (text) text.textContent = message;
    modal.style.display = 'flex';
  }

  function hideModal() {
    modal.style.display = 'none';
  }

  function validateForm() {
    const requiredIds = ['name', 'email', 'subject', 'message'];
    return requiredIds.every((id) => {
      const field = root.querySelector(`#${id}`);
      return field && field.value.trim();
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showModal('Please fill out all fields before sending your message.');
      return;
    }

    submitButton.disabled = true;
    submitButton.value = 'Sending...';

    try {
      const payload = {
        name: root.querySelector('#name')?.value || '',
        email: root.querySelector('#email')?.value || '',
        subject: root.querySelector('#subject')?.value || '',
        message: root.querySelector('#message')?.value || '',
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to send your message right now.');

      showModal('Thank you! Your message has been sent.');
      form.reset();
    } catch (error) {
      showModal(error.message || 'Unable to send your message right now.');
    } finally {
      submitButton.disabled = false;
      submitButton.value = 'Send Message';
    }
  });

  closeButton.addEventListener('click', hideModal);
}

function setupAnalytics() {
  fetch('/api/analytics/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: window.location.pathname || '/',
      title: document.title || '',
      referrer: document.referrer || '',
    }),
  }).catch(() => {});
}

function setupSecondaryButton(root) {
  const secondaryLink = root.querySelector('.secondary-button a');
  if (!secondaryLink || secondaryLink.dataset.external !== 'true') return;
  secondaryLink.addEventListener('click', function (event) {
    event.preventDefault();
    window.open('https://sidinfo22.github.io/Cyber_Threat_Analysis/', '_blank');
  });
}

function setupCardAnimations(root) {
  const cards = root.querySelectorAll('.animate-card');
  if (cards.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0.4 });
  cards.forEach((card) => observer.observe(card));
}

function setupFeatureAnimations(root) {
  const animatedElements = root.querySelectorAll('.animated');
  if (animatedElements.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('fade-in', entry.isIntersecting);
    });
  }, { threshold: 0.3 });
  animatedElements.forEach((element) => observer.observe(element));
}

function setupDiagramSelector(root) {
  const buttons = root.querySelectorAll('.selector-button');
  const diagramImage = root.querySelector('#network-diagram');
  if (buttons.length === 0 || !diagramImage) return;

  const diagrams = {
    logical: 'images/networktop.png',
    physical: 'images/physdiagram.jpg',
    cabling: 'images/NIMG.axd.png',
  };

  let currentIndex = 0;
  const updateDiagram = (index) => {
    buttons.forEach((button) => button.classList.remove('active'));
    const button = buttons[index];
    const diagramKey = button.dataset.diagram;
    button.classList.add('active');
    diagramImage.src = diagrams[diagramKey];
    diagramImage.alt = `${diagramKey} diagram`;
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      currentIndex = index;
      updateDiagram(currentIndex);
    });
  });
  updateDiagram(currentIndex);
}

export function initializeReportEnhancements(root) {
  window.toggleMenu = () => {};
  window.toggleSubMenu = () => {};

  setupNavigationMenu(root);
  setupPageFlow(root);
  setupReportFooterNavigation(root);
  setupCompactReportFooter(root);
  setupReel(root);
  setupContactForm(root);
  setupAnalytics();
  setupSecondaryButton(root);
  setupCardAnimations(root);
  setupFeatureAnimations(root);
  setupDiagramSelector(root);

  return () => {};
}
