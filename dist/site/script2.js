// "Return to Home" button functionality
document.getElementById('return-to-top').addEventListener('click', (e) => {
    e.preventDefault();
  
    // Check if the current page is already index.html
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      // Smooth scroll to the top if already on the homepage
      const startPosition = window.scrollY; // Current scroll position
      const duration = 400; // Scroll duration in milliseconds
      const startTime = performance.now();
  
      function scrollStep(currentTime) {
        const elapsed = currentTime - startTime; // Time elapsed since the start
        const progress = Math.min(elapsed / duration, 1); // Calculate progress (0 to 1)
        const scrollTo = startPosition * (1 - progress); // Smoothly reduce scroll position
  
        window.scrollTo(0, scrollTo);
  
        if (progress < 1) {
          requestAnimationFrame(scrollStep); // Continue the animation
        }
      }
  
      requestAnimationFrame(scrollStep); // Start the animation
    } else {
      // Redirect to index.html if not on the homepage
      window.location.href = 'index.html';
    }
  });
  
