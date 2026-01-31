// Clean Web Studio - Main JavaScript
// Minimal JS for mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
    // Close menu when clicking a nav link (mobile)
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  }
});
