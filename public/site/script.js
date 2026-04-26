const NAV_ITEMS = [
  { href: "objectives.html", label: "Company Objectives & Gap Analysis" },
  { href: "programming.html", label: "Research & Development" },
  { href: "assets.html", label: "Assets, Inventory & Procurement" },
  { href: "diagrams.html", label: "Documentation, Diagrams & Topologies" },
  { href: "deploy.html", label: "Infrastructure Deployment & Configurations" },
  { href: "cloud.html", label: "Hybrid Cloud Infrastructure & Scalability" },
  { href: "segmentation.html", label: "Network Segmentation, VLANs & Subnetting" },
  { href: "cybersecurity.html", label: "Cybersecurity, Data Protection & HIPAA Compliance" },
  { href: "voip.html", label: "Disaster Recovery & Backup Plan" }
];

document.addEventListener("DOMContentLoaded", () => {
  setupNavigationMenu();
  setupPageFlow();
  setupReportFooterNavigation();
  setupCompactReportFooter();
  setupReel();
  setupContactForm();
  setupAnalytics();
  setupSecondaryButton();
  setupHashCleanup();
  setupCardAnimations();
  setupQuickLinks();
  setupFeatureAnimations();
  setupDiagramSelector();
});

function setupNavigationMenu() {
  const hamburger = document.querySelector(".hamburger-menu");
  const dropdown = document.querySelector(".dropdown-menu");
  const dropdownList = dropdown?.querySelector("ul");

  if (!hamburger || !dropdown || !dropdownList) {
    return;
  }

  if (!dropdown.dataset.enhanced) {
    const currentFile = getCurrentFileName();
    const currentHeading = document.querySelector(".intro-section h1")?.textContent?.trim() || "Home";

    dropdownList.classList.add("index-menu-list");
    dropdownList.innerHTML = "";

    const statusItem = document.createElement("li");
    statusItem.className = "menu-status";
    statusItem.innerHTML = `
      <span class="menu-status-label">Current Page</span>
      <span class="menu-status-page">${currentHeading}</span>
    `;
    dropdownList.appendChild(statusItem);

    NAV_ITEMS.forEach((navItem) => {
      const item = document.createElement("li");
      item.setAttribute("data-href", navItem.href);
      item.textContent = navItem.label;
      if (navItem.href === currentFile) {
        item.classList.add("current-page-link");
      }
      dropdownList.appendChild(item);
    });

    dropdown.dataset.enhanced = "true";
  }

  const closeMenu = () => {
    hamburger.classList.remove("active");
    dropdown.classList.remove("active");
  };

  hamburger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    hamburger.classList.toggle("active");
    dropdown.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target) && !hamburger.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  dropdown.querySelectorAll("li[data-href]").forEach((item) => {
    item.addEventListener("click", () => {
      const href = item.getAttribute("data-href");
      if (href) {
        window.location.href = href;
      }
    });
  });
}

function getCurrentFileName() {
  const path = window.location.pathname.split("/").pop();
  return path || "index.html";
}

function setupPageFlow() {
  const currentFile = getCurrentFileName();
  const currentIndex = NAV_ITEMS.findIndex((item) => item.href === currentFile);
  const stickyHeader = document.querySelector(".sticky-header");

  if (currentIndex === -1 || !stickyHeader || document.querySelector(".page-flow-nav")) {
    return;
  }

  const previousItem = currentIndex === 0
    ? { href: "index.html", label: "Return to Home" }
    : NAV_ITEMS[currentIndex - 1];

  const nextItem = currentIndex === NAV_ITEMS.length - 1
    ? { href: "index.html", label: "Return to Home" }
    : NAV_ITEMS[currentIndex + 1];

  const pageFlow = document.createElement("div");
  pageFlow.className = "page-flow-nav";
  pageFlow.innerHTML = `
    <a class="page-flow-link page-flow-left" href="${previousItem.href}">
      <span class="page-flow-arrow" aria-hidden="true">←</span>
      <span class="page-flow-text">${currentIndex === 0 ? "Return to Home" : `Previous: ${previousItem.label}`}</span>
    </a>
    <a class="page-flow-link page-flow-right" href="${nextItem.href}">
      <span class="page-flow-text">${currentIndex === NAV_ITEMS.length - 1 ? "Return to Home" : `Next: ${nextItem.label}`}</span>
      <span class="page-flow-arrow" aria-hidden="true">→</span>
    </a>
  `;

  stickyHeader.insertAdjacentElement("afterend", pageFlow);
}

function setupReportFooterNavigation() {
  const currentFile = getCurrentFileName();
  const currentIndex = NAV_ITEMS.findIndex((item) => item.href === currentFile);

  if (currentIndex === -1) {
    return;
  }

  let footerContainer = document.querySelector(
    ".footer-buttons-container, .bottomBtn85-group, .bottomBtn86-group, .cl99-buttonGroup"
  );
  const pageFooter = document.querySelector(".subtle-footer");

  if (!footerContainer && pageFooter) {
    footerContainer = document.createElement("div");
    footerContainer.className = "footer-buttons-container";
    pageFooter.insertAdjacentElement("beforebegin", footerContainer);
  }

  if (!footerContainer || footerContainer.dataset.enhanced === "true") {
    return;
  }

  const previousItem = currentIndex === 0
    ? { href: "index.html", label: "Return to Home" }
    : NAV_ITEMS[currentIndex - 1];

  const nextItem = currentIndex === NAV_ITEMS.length - 1
    ? { href: "index.html", label: "Return to Home" }
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

  footerContainer.classList.add("footer-buttons-container", "report-footer-nav");
  footerContainer.dataset.buttonCount = String(buttons.length);
  footerContainer.innerHTML = buttons.join("");
  footerContainer.dataset.enhanced = "true";
}

function setupCompactReportFooter() {
  const currentFile = getCurrentFileName();
  const currentIndex = NAV_ITEMS.findIndex((item) => item.href === currentFile);
  const pageFooter = document.querySelector(".subtle-footer");
  const reportFooterNav = document.querySelector(".report-footer-nav");

  if (currentIndex === -1 || !pageFooter || document.querySelector(".compact-report-footer")) {
    return;
  }

  const footerShell = document.createElement("section");
  footerShell.className = "report-page-end";

  const compactFooter = document.createElement("section");
  compactFooter.className = "compact-report-footer";
  compactFooter.innerHTML = `
    <div class="compact-report-footer-grid">
      <div class="compact-report-footer-block">
        <h3>Quick Navigation</h3>
        <div class="compact-report-links">
          ${NAV_ITEMS.map((item) => `<a href="${item.href}" class="${item.href === currentFile ? "compact-report-current-link" : ""}">${item.label}</a>`).join("")}
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

  if (reportFooterNav) {
    footerShell.appendChild(reportFooterNav);
  }
  footerShell.appendChild(compactFooter);
  pageFooter.insertAdjacentElement("beforebegin", footerShell);
  footerShell.appendChild(pageFooter);
}

function setupReel() {
  const reelContainer = document.querySelector(".reel-container");
  if (!reelContainer || reelContainer.dataset.enhanced) {
    return;
  }

  const repeatedItems = [...NAV_ITEMS, ...NAV_ITEMS];
  reelContainer.innerHTML = repeatedItems
    .map((item) => `<a class="reel-link" href="${item.href}"><i class="fas fa-award"></i>${item.label}</a>`)
    .join("");

  reelContainer.dataset.enhanced = "true";
}

function setupContactForm() {
  const form = document.querySelector("form");
  const modal = document.getElementById("thankYouModal");
  const modalContent = document.querySelector(".modal-content");
  const closeButton = document.querySelector(".close-button");
  const submitButton = form?.querySelector('input[type="submit"]');

  if (!form || !modal || !modalContent || !closeButton || !submitButton) {
    return;
  }

  function showModal(message) {
    const text = modalContent.querySelector("p");
    if (text) {
      text.textContent = message;
    }
    modal.style.display = "flex";
  }

  function hideModal() {
    modal.style.display = "none";
  }

  function validateForm() {
    const requiredIds = ["name", "email", "subject", "message"];
    return requiredIds.every((id) => {
      const field = document.getElementById(id);
      return field && field.value.trim();
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showModal("Please fill out all fields before sending your message.");
      return;
    }

    submitButton.disabled = true;
    submitButton.value = "Sending...";

    try {
      const payload = {
        name: document.getElementById("name")?.value || "",
        email: document.getElementById("email")?.value || "",
        subject: document.getElementById("subject")?.value || "",
        message: document.getElementById("message")?.value || "",
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to send your message right now.");
      }

      showModal("Thank you! Your message has been sent.");
      form.reset();
    } catch (error) {
      showModal(error.message || "Unable to send your message right now.");
    } finally {
      submitButton.disabled = false;
      submitButton.value = "Send Message";
    }
  });

  closeButton.addEventListener("click", hideModal);

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      hideModal();
    }
  });
}

function setupAnalytics() {
  fetch("/api/analytics/pageview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: window.location.pathname || "/",
      title: document.title || "",
      referrer: document.referrer || "",
    }),
  }).catch(() => {
    // Ignore analytics failures in the client so browsing stays smooth.
  });
}

function setupSecondaryButton() {
  const secondaryLink = document.querySelector(".secondary-button a");
  if (!secondaryLink || secondaryLink.dataset.external !== "true") {
    return;
  }

  secondaryLink.addEventListener("click", function (event) {
    event.preventDefault();
    window.open("https://sidinfo22.github.io/Cyber_Threat_Analysis/", "_blank");
  });
}

function setupHashCleanup() {
  if (window.location.hash === "#contact") {
    window.history.replaceState(null, null, " ");
    window.scrollTo(0, 0);
  }
}

function setupCardAnimations() {
  const cards = document.querySelectorAll(".animate-card");
  if (cards.length === 0) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  }, { threshold: 0.4 });

  cards.forEach((card) => observer.observe(card));
}

function setupQuickLinks() {
  document.querySelectorAll(".quick-links-list a").forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetSelector = this.getAttribute("href");
      const targetSection = targetSelector ? document.querySelector(targetSelector) : null;
      if (!targetSection) {
        return;
      }

      event.preventDefault();
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}

function setupFeatureAnimations() {
  const animatedElements = document.querySelectorAll(".animated");
  if (animatedElements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("fade-in", entry.isIntersecting);
    });
  }, { threshold: 0.3 });

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

function setupDiagramSelector() {
  const buttons = document.querySelectorAll(".selector-button");
  const diagramImage = document.getElementById("network-diagram");

  if (buttons.length === 0 || !diagramImage) {
    return;
  }

  const diagrams = {
    logical: "images/networktop.png",
    physical: "images/physdiagram.jpg",
    cabling: "images/NIMG.axd.png",
  };

  let currentIndex = 0;

  const updateDiagram = (index) => {
    buttons.forEach((button) => button.classList.remove("active"));

    const button = buttons[index];
    const diagramKey = button.dataset.diagram;

    button.classList.add("active");
    diagramImage.src = diagrams[diagramKey];
    diagramImage.alt = `${diagramKey} diagram`;
  };

  setInterval(() => {
    currentIndex = (currentIndex + 1) % buttons.length;
    updateDiagram(currentIndex);
  }, 3000);

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      currentIndex = index;
      updateDiagram(currentIndex);
    });
  });

  updateDiagram(currentIndex);
}


  document.addEventListener("DOMContentLoaded", () => {
    const ciaItems = document.querySelectorAll(".cia-item");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible"); // Add 'visible' class for animation
          } else {
            entry.target.classList.remove("visible"); // Remove 'visible' class to re-trigger animation
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );
  
    ciaItems.forEach((item) => observer.observe(item));
  });








document.addEventListener("DOMContentLoaded", () => {
  const aaaCards = document.querySelectorAll(".aaa-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  aaaCards.forEach((card) => observer.observe(card));
});





// "Return to Home" / "Return to Top" button functionality
document.querySelectorAll('#return-to-top').forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      const startPosition = window.scrollY;
      const duration = 400;
      const startTime = performance.now();

      function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const scrollTo = startPosition * (1 - progress);

        window.scrollTo(0, scrollTo);

        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        }
      }

      requestAnimationFrame(scrollStep);
    } else {
      window.location.href = 'index.html';
    }
  });
});

// Legacy homepage "View Full Report" button handling
document.querySelectorAll('.footer-primary-button:not(.report-footer-button)').forEach((button) => {
  if (!button.hasAttribute('onclick')) {
    button.addEventListener('click', () => {
      window.location.href = 'objectives.html';
    });
  }
});

// Legacy homepage primary CTA handling
const homePrimaryButton = document.querySelector('.primary-button');
if (homePrimaryButton) {
  homePrimaryButton.addEventListener('click', function() {
    window.location.href = 'objectives.html';
  });
}












  










/*******************************************************
 * AUTO-PLAY CAROUSEL "72"
 *******************************************************/
let slideIndex72 = 0;
let slides72 = [];
let autoSlideInterval72 = null;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
  slides72 = document.querySelectorAll('.carousel72-slide');
  // Show the first slide
  showSlide72(slideIndex72);

  // Set up auto-play every 3 seconds
  autoSlideInterval72 = setInterval(function () {
    moveSlide72(1); // Advance one slide
  }, 3000); // 3000ms = 3 seconds
});

/**
 * Show the slide at slideIndex72
 */
function showSlide72(n) {
  // Wrap around if the index goes out of bounds
  if (n >= slides72.length) {
    slideIndex72 = 0;
  }
  if (n < 0) {
    slideIndex72 = slides72.length - 1;
  }

  // Hide all slides
  slides72.forEach((slide) => {
    slide.style.display = 'none';
    slide.classList.remove('active72');
  });

  // Display the current slide
  slides72[slideIndex72].style.display = 'block';
  slides72[slideIndex72].classList.add('active72');
}

/**
 * Move the slide by "step" (either +1 or -1)
 */
function moveSlide72(step) {
  // Clear and restart auto-slide timer so user can see the new slide longer
  if (autoSlideInterval72) {
    clearInterval(autoSlideInterval72);
    autoSlideInterval72 = setInterval(function () {
      moveSlide72(1);
    }, 3000);
  }

  slideIndex72 += step;
  showSlide72(slideIndex72);
}











  

document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    let scrollAmount = 0;
    const scrollSpeed = 2; // Pixels to scroll at a time
    const intervalTime = 30; // Speed of scrolling in milliseconds

    function autoScroll() {
        // Increment scroll position
        scrollAmount += scrollSpeed;

        // Reset scroll position if we've reached the end
        if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
            scrollAmount = 0;
            carousel.scrollLeft = 0; // Reset to the start
        }

        // Apply scroll position
        carousel.scrollLeft = scrollAmount;
    }

    // Start automatic scrolling
    const scrollInterval = setInterval(autoScroll, intervalTime);
});

document.addEventListener("DOMContentLoaded", function () {
    const badges = document.querySelectorAll(".badges img");
    const body = document.querySelector("body");

    badges.forEach((badge) => {
        badge.addEventListener("click", () => {
            // Create the overlay
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.zIndex = "1000";

            // Create the pop-up container
            const popupContainer = document.createElement("div");
            popupContainer.style.position = "relative";
            popupContainer.style.padding = "10px";
            popupContainer.style.backgroundColor = "transparent";
            popupContainer.style.borderRadius = "12px"; // Rounded edges
            popupContainer.style.maxWidth = "250px";
            popupContainer.style.maxHeight = "250px";
            popupContainer.style.textAlign = "center";

            // Create the enlarged image
            const enlargedImg = document.createElement("img");
            enlargedImg.src = badge.src;
            enlargedImg.alt = badge.alt;
            enlargedImg.style.width = "100%";
            enlargedImg.style.height = "auto";
            enlargedImg.style.border = "none";
            enlargedImg.style.backgroundColor = "transparent";
            enlargedImg.style.objectFit = "contain";
            enlargedImg.style.borderRadius = "12px";

            // Create the close button
const closeButton = document.createElement("button");
closeButton.innerHTML = "&times;";
closeButton.className = "popup-close-button"; // Add class for styling
closeButton.style.position = "absolute";
closeButton.style.top = "20px";
closeButton.style.right = "20px";
closeButton.style.border = "none"; // Remove border
closeButton.style.outline = "none"; // Remove outline
closeButton.style.background = "none"; // Transparent background
closeButton.style.padding = "0"; // Remove padding
closeButton.style.boxShadow = "none"; // Remove shadow
closeButton.style.cursor = "pointer"; // Pointer cursor for interactivity

            // Append elements
            popupContainer.appendChild(enlargedImg);
            popupContainer.appendChild(closeButton);
            overlay.appendChild(popupContainer);
            body.appendChild(overlay);

            // Close on click outside
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });

            // Close on button click
            closeButton.addEventListener("click", () => {
                overlay.remove();
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const certifications = document.querySelectorAll(".certification-gallery img");
    const body = document.querySelector("body");

    certifications.forEach((certification) => {
        certification.addEventListener("click", () => {
            // Create the overlay
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center"; // Center vertically
            overlay.style.justifyContent = "center"; // Center horizontally
            overlay.style.zIndex = "1000";

            // Create the pop-up container
            const popupContainer = document.createElement("div");
            popupContainer.style.position = "relative";
            popupContainer.style.backgroundColor = "white";
            popupContainer.style.borderRadius = "12px"; // Rounded edges
            popupContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)";
            popupContainer.style.overflow = "hidden";
            popupContainer.style.width = "80%"; // Default width for readability
            popupContainer.style.height = "auto"; // Adjust height proportionally
            popupContainer.style.maxWidth = "600px"; // Limit size on larger screens
            popupContainer.style.maxHeight = "90%"; // Limit height on smaller screens
            popupContainer.style.transform = "translateY(5%)"; // Slightly below center

            // Create the enlarged image
            const enlargedImg = document.createElement("img");
            enlargedImg.src = certification.src;
            enlargedImg.alt = certification.alt;
            enlargedImg.style.display = "block";
            enlargedImg.style.width = "100%";
            enlargedImg.style.height = "auto";

            // Create the close button
            const closeButton = document.createElement("button");
            closeButton.innerHTML = "&times;";
            closeButton.style.position = "absolute";
            closeButton.style.top = "10px";
            closeButton.style.right = "10px";
            closeButton.style.fontSize = "24px";
            closeButton.style.color = "#000"; // Black color for visibility
            closeButton.style.border = "none"; // Remove border
            closeButton.style.outline = "none"; // Remove outline
            closeButton.style.background = "none"; // No background
            closeButton.style.cursor = "pointer";
            closeButton.style.padding = "0";

            // Append elements
            popupContainer.appendChild(enlargedImg);
            popupContainer.appendChild(closeButton);
            overlay.appendChild(popupContainer);
            body.appendChild(overlay);

            // Close on click outside
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });

            // Close on button click
            closeButton.addEventListener("click", () => {
                overlay.remove();
            });
        });
    });
});
