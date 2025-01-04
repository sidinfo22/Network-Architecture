const hamburger = document.querySelector('.hamburger-menu');
const dropdown = document.querySelector('.dropdown-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  dropdown.classList.toggle('active');
});



document.addEventListener('click', (event) => {
    const isClickInsideMenu = document.querySelector('.dropdown-menu').contains(event.target);
    const isHamburger = document.querySelector('.hamburger-menu').contains(event.target);
  
    if (!isClickInsideMenu && !isHamburger) {
      // Close the dropdown menu
      const dropdown = document.querySelector('.dropdown-menu');
      const hamburger = document.querySelector('.hamburger-menu');
      dropdown.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });


document.addEventListener("DOMContentLoaded", function () {
    const reelContainer = document.querySelector(".reel-container");
    const reelContent = reelContainer.innerHTML;
    reelContainer.innerHTML += reelContent; // Duplicate content for seamless scrolling
  });



  function toggleSubMenu() {
    const subMenu = document.querySelector('.menu-item .sub-menu');
    subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
  }




// contact us scripts 

// JavaScript for Modal
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const modal = document.getElementById("thankYouModal");
    const modalContent = document.querySelector(".modal-content");
    const closeButton = document.querySelector(".close-button");

    // Function to show the modal
    function showModal(message) {
        modalContent.querySelector("p").textContent = message; // Update modal message
        modal.style.display = "flex"; // Show modal with flex for centering
    }

    // Function to hide the modal
    function hideModal() {
        modal.style.display = "none";
    }

    // Validate the form inputs
    function validateForm() {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !subject || !message) {
            return false;
        }
        return true;
    }

    // Add event listener to form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the form from reloading the page

        // Validate form inputs
        if (validateForm()) {
            showModal("Thank you! Your message has been sent."); // Show success message
            form.reset(); // Clear the form
        } else {
            showModal("Please fill out all fields before sending your message."); // Show error message
        }
    });

    // Close modal when clicking the X button
    closeButton.addEventListener("click", hideModal);

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
});


document.querySelector('.secondary-button a').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default anchor behavior
  
    const target = document.querySelector('#contact'); // Target section
    const targetPosition = target.getBoundingClientRect().top + window.scrollY; // Get target position
    const startPosition = window.scrollY; // Current scroll position
    const distance = targetPosition - startPosition; // Distance to scroll
    const duration = 1500; // Duration of the scroll in milliseconds
    let start = null;
  
    // Smooth scroll animation function
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const scrollAmount = Math.easeInOutQuad(progress, startPosition, distance, duration);
      window.scrollTo(0, scrollAmount);
      if (progress < duration) {
        requestAnimationFrame(step); // Continue animation
      }
    }
  
    // Easing function for smooth effect
    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };
  
    requestAnimationFrame(step); // Start the animation
  });

  document.addEventListener('DOMContentLoaded', function () {
    // Remove hash from URL if it exists
    if (window.location.hash === '#contact') {
      window.history.replaceState(null, null, ' '); // Remove the hash from the URL
      window.scrollTo(0, 0); // Scroll back to the top of the page
    }
  });


// Toggle menu visibility
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
  
    // Check if the menu is already open
    if (dropdownMenu.classList.contains('open')) {
      // Close the menu
      dropdownMenu.classList.remove('open');
      hamburger.classList.remove('active');
    } else {
      // Open the menu
      dropdownMenu.classList.add('open');
      hamburger.classList.add('active');
    }
  }
  
  // Close the menu when the "Home" button is clicked
  document.querySelector('.home-link').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default anchor behavior
    window.scrollTo({
      top: 0, // Scroll to the top of the page
      behavior: 'smooth', // Smooth scrolling
    });
  
    // Close the menu
    const hamburger = document.querySelector('.hamburger-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });





//animate cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.animate-card');
  
    const observerOptions = {
      threshold: 0.4, // Trigger when 20% of the card is visible
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible'); // Add 'visible' class for animation
        } else {
          entry.target.classList.remove('visible'); // Remove 'visible' when out of view
        }
      });
    }, observerOptions);
  
    cards.forEach((card) => observer.observe(card));
  });







// quick lnks smooth scrolling 
document.querySelectorAll('.quick-links-list a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});


//scroll effect for redudanct and ha 
// Add scroll effect to show the cards when they come into view
document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll(".animated");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add the fade-in class when the element is visible
            entry.target.classList.add("fade-in");
          } else {
            // Remove the fade-in class when the element goes out of view
            entry.target.classList.remove("fade-in");
          }
        });
      },
      { threshold: 0.3 } // Trigger when 10% of the element is visible
    );
  
    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  });


//3 button slider 
// 3-button slider with auto-switching
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".selector-button");
    const diagramImage = document.getElementById("network-diagram");
  
    const diagrams = {
      logical: "images/networktop.png",
      physical: "images/physdiagram.jpg",
      cabling: "images/NIMG.axd.png",
    };
  
    let currentIndex = 0; // Track the current active button
  
    // Function to update the active button and diagram
    const updateDiagram = (index) => {
      // Remove active class from all buttons
      buttons.forEach((btn) => btn.classList.remove("active"));
  
      // Get the button and key corresponding to the current index
      const button = buttons[index];
      const diagramKey = button.dataset.diagram;
  
      // Add active class to the current button
      button.classList.add("active");
  
      // Update the diagram image
      diagramImage.src = diagrams[diagramKey];
      diagramImage.alt = `${diagramKey} diagram`;
    };
  
    // Automatically switch between buttons every 3 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % buttons.length; // Cycle through buttons
      updateDiagram(currentIndex);
    }, 3000); // Adjust time interval here (3000ms = 3 seconds)
  
    // Add click event listeners for manual switching
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        currentIndex = index; // Update the current index to the clicked button
        updateDiagram(currentIndex);
      });
    });
  
    // Initialize the first diagram
    updateDiagram(currentIndex);
  });











  

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